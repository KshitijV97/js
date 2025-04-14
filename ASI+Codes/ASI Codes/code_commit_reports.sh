#!/bin/bash

# Multi-Repository Git Commit Report Generator
# This script analyzes multiple Git repositories and generates a combined CSV report
# showing the number of commits per committer across all repositories.

# ===== Configuration Variables (EDIT THESE) =====
# Array of paths to Git repositories to analyze
# Add as many repository paths as needed, separated by spaces
REPO_PATHS=(
    "/path/to/first/repo"
    "/path/to/second/repo"
    "/path/to/third/repo"
    # Add more repositories as needed
)
# Alternatively, you can use the current directory as one of the paths:
# REPO_PATHS=("." "/path/to/other/repo")

# Name of the output CSV file that will be generated
OUTPUT_FILE="combined_commit_report.csv"     
# The Git branch that will be analyzed in each repository - defaults to master
BRANCH="master"                     
# Number of days to analyze - setting to 0 analyzes entire history
DAYS_TO_ANALYZE=0

# ===== Validation =====
# Check if the git command is available in the system
command -v git >/dev/null 2>&1 || { echo "Error: git is required but not installed. Aborting."; exit 1; }

# Check if we have at least one repository path
if [ ${#REPO_PATHS[@]} -eq 0 ]; then
    echo "Error: No repository paths specified. Please configure REPO_PATHS array."
    exit 1
fi

# ===== Initialize CSV File =====
# Create the CSV file with a header row defining the column names
echo "Repository,Committer Name,Committer Email,Commit Count" > "$OUTPUT_FILE"

# ===== Helper Functions =====
# Function to extract the repository name from the remote URL or directory name
get_repo_name() {
    local repo_path=$1
    # Try to get the remote origin URL from Git configuration
    local remote_url=$(cd "$repo_path" && git config --get remote.origin.url 2>/dev/null)
    
    if [ -n "$remote_url" ]; then
        # If remote URL exists (string is not empty), extract the repository name from it
        echo "$remote_url" | sed -E 's/.*\/([^\/]+)(\.git)?$/\1/'
    else
        # If there's no remote URL, use the directory name as the repository name
        basename "$(cd "$repo_path" && pwd)"
    fi
}

# Function to analyze a single repository
analyze_repository() {
    local repo_path=$1
    
    # Check if the provided path is actually a Git repository
    if [ ! -d "$repo_path/.git" ] && [ ! -f "$repo_path/.git" ]; then
        echo "Error: '$repo_path' is not a Git repository. Skipping."
        return 1
    fi
    
    # Change to the repository directory
    cd "$repo_path" || { echo "Error: Could not change to repository directory '$repo_path'. Skipping."; return 1; }
    
    # Get the repository name
    local repo_name=$(get_repo_name "$repo_path")
    echo "Analyzing repository: $repo_name ($repo_path)"
    
    # Verify the branch exists before trying to check it out
    if ! git show-ref --verify --quiet "refs/heads/$BRANCH"; then
        echo "Warning: Branch '$BRANCH' does not exist in repository '$repo_name'. Skipping."
        return 1
    fi
    
    # Checkout the branch we want to analyze (save current branch first)
    local current_branch=$(git symbolic-ref --short HEAD 2>/dev/null || git rev-parse HEAD)
    echo "  Checking out branch: $BRANCH (current branch was: $current_branch)"
    git checkout "$BRANCH" > /dev/null 2>&1 || { echo "  Error: Failed to checkout branch '$BRANCH'. Skipping."; git checkout "$current_branch" > /dev/null 2>&1; return 1; }
    
    # Prepare the git log parameters based on date range
    local git_date_param=""
    if [ "$DAYS_TO_ANALYZE" -gt 0 ]; then
        echo "  Analyzing commits from the last $DAYS_TO_ANALYZE days"
        git_date_param="--since=\"$DAYS_TO_ANALYZE days ago\""
    else
        echo "  Analyzing all commit history"
    fi
    
    # Create a temporary directory to store intermediate files
    local temp_dir=$(mktemp -d)
    
    # Get all commits and extract author information
    echo "  Extracting commit information..."
    eval "git log $git_date_param --pretty=format:'%H|%ae|%an' $BRANCH" > "$temp_dir/all_commits.txt"
    
    # Count total number of commits found
    local total_commits=$(wc -l < "$temp_dir/all_commits.txt")
    echo "  Found $total_commits total commits"
    
    # Skip further processing if no commits were found
    if [ "$total_commits" -eq 0 ]; then
        echo "  No commits found in specified time period. Skipping."
        # Go back to the original branch
        git checkout "$current_branch" > /dev/null 2>&1
        rm -rf "$temp_dir"
        return 0
    fi
    
    # Extract unique committer email addresses
    cut -d'|' -f2 "$temp_dir/all_commits.txt" | sort | uniq > "$temp_dir/committers.txt"
    local committer_count=$(wc -l < "$temp_dir/committers.txt")
    echo "  Found $committer_count unique committers"
    
    # Process each committer and generate statistics
    echo "  Analyzing committer statistics..."
    while read -r committer_email; do
        # Skip empty lines if any
        if [ -z "$committer_email" ]; then
            continue
        fi
        
        # Get the committer's name
        local committer_name=$(grep "|$committer_email|" "$temp_dir/all_commits.txt" | head -1 | cut -d'|' -f3)
        
        # Count total commits for this committer
        local commit_count=$(grep "|$committer_email|" "$temp_dir/all_commits.txt" | wc -l)
        
        # Add the committer's information to the CSV report
        # Properly escape values for CSV format
        local name_escaped=$(echo "$committer_name" | sed 's/"/""/g')
        local email_escaped=$(echo "$committer_email" | sed 's/"/""/g')
        echo "$repo_name,\"$name_escaped\",\"$email_escaped\",$commit_count" >> "$OUTPUT_FILE"
        
        echo "    Processed committer: $committer_name ($commit_count commits)"
        
    done < "$temp_dir/committers.txt"
    
    # Clean up temporary files
    rm -rf "$temp_dir"
    
    # Go back to the original branch
    git checkout "$current_branch" > /dev/null 2>&1
    
    return 0
}

# ===== Main Script =====
echo "Starting multi-repository analysis for ${#REPO_PATHS[@]} repositories..."

# Process each repository
repo_count=0
successful_repos=0

for repo_path in "${REPO_PATHS[@]}"; do
    ((repo_count++))
    echo "[$repo_count/${#REPO_PATHS[@]}] Processing repository: $repo_path"
    
    # Store current directory to return to it later
    original_dir=$(pwd)
    
    # Analyze the repository
    if analyze_repository "$repo_path"; then
        ((successful_repos++))
    fi
    
    # Return to original directory
    cd "$original_dir"
    
    echo "----------------------------------------"
done

echo "Report generation complete!"
echo "Successfully analyzed $successful_repos out of ${#REPO_PATHS[@]} repositories."
echo "CSV report saved to: $OUTPUT_FILE"

# Only show the report if at least one repository was successfully analyzed
if [ $successful_repos -gt 0 ]; then
    # Count total committers and commits across all repositories
    total_commits=$(tail -n +2 "$OUTPUT_FILE" | awk -F, '{sum+=$4} END {print sum}')
    total_committers=$(tail -n +2 "$OUTPUT_FILE" | awk -F, '{print $3}' | sort | uniq | wc -l)
    
    echo "Overall statistics:"
    echo "  Total unique committers: $total_committers"
    echo "  Total commits: $total_commits"
    
    # Display a preview of the report
    echo "Report preview (first 10 entries):"
    echo "----------------------------------------"
    head -n 11 "$OUTPUT_FILE" | column -t -s ','
fi
