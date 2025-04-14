#!/bin/bash

# Git Master Branch Commit Report Generator
# This script analyzes a local Git repository and generates a CSV report
# showing the number of commits per committer on the master branch.

# ===== Configuration Variables (EDIT THESE) =====
REPO_PATH="."                       # Path to the Git repository (default: current directory)
OUTPUT_FILE="commit_report.csv"     # Output file name
BRANCH="master"                     # Branch to analyze (default: master)
# Number of days to analyze (0 = all history)
DAYS_TO_ANALYZE=0

# ===== Validation =====
# Check for required tools
command -v git >/dev/null 2>&1 || { echo "Error: git is required but not installed. Aborting."; exit 1; }

# Check if the repository exists and is a git repository
if [ ! -d "$REPO_PATH/.git" ] && [ ! -f "$REPO_PATH/.git" ]; then
    echo "Error: '$REPO_PATH' is not a Git repository. Please provide a valid repository path."
    exit 1
fi

# ===== Initialize CSV File =====
echo "Repository,Committer Name,Committer Email,Commit Count" > "$OUTPUT_FILE"

# ===== Helper Functions =====
get_repo_name() {
    # Extract repository name from remote URL or directory name
    local remote_url=$(cd "$REPO_PATH" && git config --get remote.origin.url 2>/dev/null)
    
    if [ -n "$remote_url" ]; then
        # Extract repo name from remote URL
        echo "$remote_url" | sed -E 's/.*\/([^\/]+)(\.git)?$/\1/'
    else
        # Use directory name as fallback
        basename "$(cd "$REPO_PATH" && pwd)"
    fi
}

# ===== Main Script =====
echo "Starting Git repository analysis..."

# Change to repository directory
cd "$REPO_PATH" || { echo "Error: Could not change to repository directory."; exit 1; }

# Ensure we're on the specified branch
echo "Checking out branch: $BRANCH"
git checkout "$BRANCH" > /dev/null 2>&1 || { echo "Error: Failed to checkout branch '$BRANCH'. Aborting."; exit 1; }

# Get repository name
REPO_NAME=$(get_repo_name)
echo "Analyzing repository: $REPO_NAME"

# Prepare git log parameters based on date range
GIT_DATE_PARAM=""
if [ "$DAYS_TO_ANALYZE" -gt 0 ]; then
    echo "Analyzing commits from the last $DAYS_TO_ANALYZE days"
    GIT_DATE_PARAM="--since=\"$DAYS_TO_ANALYZE days ago\""
else
    echo "Analyzing all commit history"
fi

# Create a temporary directory for processing
temp_dir=$(mktemp -d)

# Get all commits and extract author information
echo "Extracting commit information..."
eval "git log $GIT_DATE_PARAM --pretty=format:'%H|%ae|%an' $BRANCH" > "$temp_dir/all_commits.txt"

total_commits=$(wc -l < "$temp_dir/all_commits.txt")
echo "Found $total_commits total commits"

# Get unique committers
cut -d'|' -f2 "$temp_dir/all_commits.txt" | sort | uniq > "$temp_dir/committers.txt"
committer_count=$(wc -l < "$temp_dir/committers.txt")
echo "Found $committer_count unique committers"

# Process each committer
echo "Analyzing committer statistics..."
while read -r committer_email; do
    if [ -z "$committer_email" ]; then
        continue
    fi
    
    # Get committer name
    committer_name=$(grep "|$committer_email|" "$temp_dir/all_commits.txt" | head -1 | cut -d'|' -f3)
    
    # Count total commits for this committer
    commit_count=$(grep "|$committer_email|" "$temp_dir/all_commits.txt" | wc -l)
    
    # Add to CSV report - properly escape values for CSV
    name_escaped=$(echo "$committer_name" | sed 's/"/""/g')
    email_escaped=$(echo "$committer_email" | sed 's/"/""/g')
    echo "$REPO_NAME,\"$name_escaped\",\"$email_escaped\",$commit_count" >> "$OUTPUT_FILE"
    
    echo "  Processed committer: $committer_name ($commit_count commits)"
    
done < "$temp_dir/committers.txt"

# Clean up temporary files
rm -rf "$temp_dir"

echo "Report generation complete!"
echo "CSV report saved to: $OUTPUT_FILE"

# Optional: Display the report
echo "Report preview:"
echo "----------------"
cat "$OUTPUT_FILE" | column -t -s ','
