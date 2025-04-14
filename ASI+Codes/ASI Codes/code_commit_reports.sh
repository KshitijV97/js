#!/bin/bash

# Completely Rewritten Multi-Repository Git Commit Report Generator
# This script analyzes multiple Git repositories and generates a combined CSV report
# showing the number of commits per committer across all repositories.

# ===== Configuration Variables (EDIT THESE) =====
# Array of paths to Git repositories to analyze
REPO_PATHS=(
    "/path/to/first/repo"
    "/path/to/second/repo"
    "/path/to/third/repo"
    # Add more repositories as needed
)

# Name of the output CSV file that will be generated
OUTPUT_FILE="combined_commit_report.csv"     
# The Git branch that will be analyzed in each repository - defaults to master
BRANCH="master"                     
# Number of days to analyze - setting to 0 analyzes entire history
DAYS_TO_ANALYZE=0

# ===== Basic Validation =====
# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is required but not installed. Aborting."
    exit 1
fi

# Check if we have at least one repository path
if [ ${#REPO_PATHS[@]} -eq 0 ]; then
    echo "Error: No repository paths specified. Please configure REPO_PATHS array."
    exit 1
fi

# ===== Initialize CSV File =====
echo "Repository,Committer Name,Committer Email,Commit Count" > "$OUTPUT_FILE"

# ===== Main Script =====
echo "Starting multi-repository analysis..."
echo "Will analyze these repositories:"
for repo in "${REPO_PATHS[@]}"; do
    echo "  - $repo"
done

# Track the original directory to always return to it
ORIGINAL_DIR="$(pwd)"

# Variables to track progress
successful_repos=0
total_repos=${#REPO_PATHS[@]}

# Process each repository
for ((i=0; i<${#REPO_PATHS[@]}; i++)); do
    repo_path="${REPO_PATHS[$i]}"
    echo ""
    echo "[$((i+1))/$total_repos] Analyzing repository: $repo_path"
    
    # Make sure we start from the original directory
    cd "$ORIGINAL_DIR" || { echo "Error: Could not return to original directory. Aborting."; exit 1; }
    
    # Verify repo path exists
    if [ ! -d "$repo_path" ]; then
        echo "  Error: Directory does not exist. Skipping."
        continue
    fi
    
    # Navigate to the repository
    cd "$repo_path" || { echo "  Error: Could not change to repository directory. Skipping."; continue; }
    
    # Verify this is a git repository
    if [ ! -d ".git" ] && [ ! -f ".git" ]; then
        echo "  Error: Not a git repository. Skipping."
        continue
    fi
    
    echo "  Successfully navigated to repository at: $(pwd)"
    
    # Get repository name (from remote URL or directory name)
    repo_name=""
    remote_url=$(git config --get remote.origin.url 2>/dev/null)
    if [ -n "$remote_url" ]; then
        # Extract repo name from URL
        repo_name=$(echo "$remote_url" | sed -E 's/.*\/([^\/]+)(\.git)?$/\1/')
    else
        # Use directory name
        repo_name=$(basename "$(pwd)")
    fi
    echo "  Repository name: $repo_name"
    
    # Save current branch to restore it later
    current_branch=$(git symbolic-ref --short HEAD 2>/dev/null || git rev-parse HEAD)
    echo "  Current branch: $current_branch"
    
    # Check if target branch exists
    if ! git show-ref --verify --quiet "refs/heads/$BRANCH"; then
        echo "  Error: Branch '$BRANCH' does not exist. Skipping."
        continue
    fi
    
    # Checkout the branch we want to analyze
    echo "  Checking out branch: $BRANCH"
    if ! git checkout "$BRANCH" &> /dev/null; then
        echo "  Error: Failed to checkout branch '$BRANCH'. Skipping."
        continue
    fi
    
    # Create a temporary directory for this repository's data
    temp_dir=$(mktemp -d)
    
    # Prepare git log command based on date range
    git_log_cmd="git log"
    if [ "$DAYS_TO_ANALYZE" -gt 0 ]; then
        echo "  Analyzing commits from the last $DAYS_TO_ANALYZE days"
        git_log_cmd="$git_log_cmd --since=$DAYS_TO_ANALYZE.days.ago"
    else
        echo "  Analyzing all commit history"
    fi
    
    # Get commit information
    echo "  Extracting commit information..."
    $git_log_cmd --pretty=format:"%H|%ae|%an" "$BRANCH" > "$temp_dir/all_commits.txt"
    
    # Count total commits
    total_commits=$(wc -l < "$temp_dir/all_commits.txt")
    echo "  Found $total_commits total commits"
    
    if [ "$total_commits" -eq 0 ]; then
        echo "  No commits found in the specified time period. Skipping."
        rm -rf "$temp_dir"
        # Restore original branch
        git checkout "$current_branch" &> /dev/null
        continue
    fi
    
    # Get unique committers
    cut -d'|' -f2 "$temp_dir/all_commits.txt" | sort | uniq > "$temp_dir/committers.txt"
    committer_count=$(wc -l < "$temp_dir/committers.txt")
    echo "  Found $committer_count unique committers"
    
    # Process each committer
    echo "  Processing committer statistics..."
    while read -r committer_email; do
        if [ -z "$committer_email" ]; then
            continue
        fi
        
        # Get committer name
        committer_name=$(grep "|$committer_email|" "$temp_dir/all_commits.txt" | head -1 | cut -d'|' -f3)
        
        # Count commits
        commit_count=$(grep "|$committer_email|" "$temp_dir/all_commits.txt" | wc -l)
        
        # Escape values for CSV
        name_escaped=$(echo "$committer_name" | sed 's/"/""/g')
        email_escaped=$(echo "$committer_email" | sed 's/"/""/g')
        
        # Add to CSV report
        echo "$repo_name,\"$name_escaped\",\"$email_escaped\",$commit_count" >> "$OUTPUT_FILE"
        
        echo "    Processed committer: $committer_name ($commit_count commits)"
    done < "$temp_dir/committers.txt"
    
    # Clean up
    rm -rf "$temp_dir"
    
    # Restore original branch
    echo "  Restoring original branch: $current_branch"
    git checkout "$current_branch" &> /dev/null
    
    # Mark as successful
    ((successful_repos++))
    
    echo "  Repository analysis complete"
    echo "----------------------------------------"
done

# Always return to original directory
cd "$ORIGINAL_DIR"

echo ""
echo "Report generation complete!"
echo "Successfully analyzed $successful_repos out of $total_repos repositories."
echo "CSV report saved to: $OUTPUT_FILE"

# Display summary if any repositories were analyzed
if [ $successful_repos -gt 0 ]; then
    # Count total committers and commits
    total_commits=$(tail -n +2 "$OUTPUT_FILE" | awk -F, '{sum+=$4} END {print sum}')
    total_committers=$(tail -n +2 "$OUTPUT_FILE" | awk -F, '{print $3}' | sort | uniq | wc -l)
    
    echo ""
    echo "Overall statistics:"
    echo "  Total unique committers: $total_committers"
    echo "  Total commits: $total_commits"
    
    # Display a preview of the report
    echo ""
    echo "Report preview (first 10 entries):"
    echo "----------------------------------------"
    head -n 11 "$OUTPUT_FILE" | column -t -s ','
fi
