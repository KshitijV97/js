#!/bin/bash

# Local Git Repository Commit Report Generator
# This script analyzes a local Git repository and generates a CSV report
# showing committer statistics and peer review information.
#
# The report includes:
#  - Number of code committers
#  - Commits per committer
#  - Estimated peer review status based on merge patterns

# ===== Configuration Variables (EDIT THESE) =====
REPO_PATH="."                       # Path to the Git repository (default: current directory)
OUTPUT_FILE="commit_report.csv"     # Output file name
BRANCH="master"                     # Branch to analyze (default: master)
# Define patterns that indicate a commit went through peer review
# You can add more patterns specific to your team's workflow
REVIEW_PATTERNS=(
  "Merge pull request"
  "Reviewed-by:"
  "PR:"
  "Pull request"
)
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
echo "Repository,Committer Name,Committer Email,Commit Count,Peer Reviewed Commits,Peer Review Percentage" > "$OUTPUT_FILE"

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

# Check if a commit has indications of peer review
is_reviewed_commit() {
    local commit_hash=$1
    local commit_msg=$(cd "$REPO_PATH" && git log -1 --pretty=format:"%B" "$commit_hash")
    
    # Check if commit is a merge commit
    local is_merge=$(cd "$REPO_PATH" && git rev-list --merges -n 1 "$commit_hash" 2>/dev/null)
    if [ -n "$is_merge" ]; then
        return 0 # True, it's a merge commit
    fi
    
    # Check if commit message contains any review patterns
    for pattern in "${REVIEW_PATTERNS[@]}"; do
        if echo "$commit_msg" | grep -q "$pattern"; then
            return 0 # True, found a review pattern
        fi
    done
    
    return 1 # False, no evidence of review
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
    
    # Count peer-reviewed commits
    reviewed_count=0
    
    # For each commit by this committer, check if it was reviewed
    grep "|$committer_email|" "$temp_dir/all_commits.txt" | cut -d'|' -f1 | while read -r commit_hash; do
        if is_reviewed_commit "$commit_hash"; then
            # Create a marker file for each reviewed commit
            touch "$temp_dir/reviewed_$commit_hash"
        fi
    done
    
    # Count the marker files to get the number of reviewed commits
    reviewed_count=$(ls -1 "$temp_dir/reviewed_"* 2>/dev/null | wc -l)
    
    # Calculate peer review percentage
    if [ "$commit_count" -gt 0 ]; then
        review_percentage=$(awk "BEGIN { printf \"%.2f\", ($reviewed_count / $commit_count) * 100 }")
    else
        review_percentage="0.00"
    fi
    
    # Add to CSV report - properly escape values for CSV
    name_escaped=$(echo "$committer_name" | sed 's/"/""/g')
    email_escaped=$(echo "$committer_email" | sed 's/"/""/g')
    echo "$REPO_NAME,\"$name_escaped\",\"$email_escaped\",$commit_count,$reviewed_count,$review_percentage%" >> "$OUTPUT_FILE"
    
    echo "  Processed committer: $committer_name ($commit_count commits, $reviewed_count reviewed)"
    
done < "$temp_dir/committers.txt"

# Clean up temporary files
rm -rf "$temp_dir"

echo "Report generation complete!"
echo "CSV report saved to: $OUTPUT_FILE"

# Optional: Display the report
echo "Report preview:"
echo "----------------"
cat "$OUTPUT_FILE" | column -t -s ','
