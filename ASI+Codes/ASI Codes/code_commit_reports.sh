#!/bin/bash

# Monthly Git Commit Report Generator
# This script analyzes a local Git repository and generates a CSV report
# showing month-wise commit counts per committer for the specified time period.

# ===== Configuration Variables (EDIT THESE) =====
REPO_PATH="."                       # Path to the Git repository (default: current directory)
OUTPUT_FILE="monthly_commit_report.csv"  # Output file name
BRANCH="master"                     # Branch to analyze (default: master)
DAYS_TO_ANALYZE=365                 # Number of days to analyze (default: 365 days)

# ===== Validation =====
# Check for required tools
command -v git >/dev/null 2>&1 || { echo "Error: git is required but not installed. Aborting."; exit 1; }

# Check if the repository exists and is a git repository
if [ ! -d "$REPO_PATH/.git" ] && [ ! -f "$REPO_PATH/.git" ]; then
    echo "Error: '$REPO_PATH' is not a Git repository. Please provide a valid repository path."
    exit 1
fi

# ===== Initialize CSV File =====
echo "Repository,Committer Name,Committer Email,Year,Month,Commit Count" > "$OUTPUT_FILE"

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

# Function to get month name from month number
get_month_name() {
    local month_num=$1
    case $month_num in
        01) echo "January" ;;
        02) echo "February" ;;
        03) echo "March" ;;
        04) echo "April" ;;
        05) echo "May" ;;
        06) echo "June" ;;
        07) echo "July" ;;
        08) echo "August" ;;
        09) echo "September" ;;
        10) echo "October" ;;
        11) echo "November" ;;
        12) echo "December" ;;
        *) echo "Unknown" ;;
    esac
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
if [ "$DAYS_TO_ANALYZE" -gt 0 ]; then
    echo "Analyzing commits from the last $DAYS_TO_ANALYZE days"
    DATE_FILTER="--since=$DAYS_TO_ANALYZE.days.ago"
else
    echo "Analyzing all commit history"
    DATE_FILTER=""
fi

# Create a temporary directory for processing
temp_dir=$(mktemp -d)

# Get all commits with dates and extract author information
echo "Extracting commit information with dates..."
git log $DATE_FILTER --date=format:"%Y-%m" --pretty=format:"%H|%ae|%an|%ad" $BRANCH > "$temp_dir/all_commits.txt"

total_commits=$(wc -l < "$temp_dir/all_commits.txt")
echo "Found $total_commits total commits in the specified time period"

# Get unique committers
cut -d'|' -f2 "$temp_dir/all_commits.txt" | sort | uniq > "$temp_dir/committers.txt"
committer_count=$(wc -l < "$temp_dir/committers.txt")
echo "Found $committer_count unique committers"

# Get unique year-month combinations in chronological order
cut -d'|' -f4 "$temp_dir/all_commits.txt" | sort -u > "$temp_dir/months.txt"
month_count=$(wc -l < "$temp_dir/months.txt")
echo "Found $month_count unique months with commit activity"

# Process each committer
echo "Analyzing monthly commit statistics..."
while read -r committer_email; do
    if [ -z "$committer_email" ]; then
        continue
    fi
    
    # Get committer name
    committer_name=$(grep "|$committer_email|" "$temp_dir/all_commits.txt" | head -1 | cut -d'|' -f3)
    
    echo "  Processing committer: $committer_name"
    
    # Count commits per month for this committer
    while read -r year_month; do
        if [ -z "$year_month" ]; then
            continue
        fi
        
        # Parse year and month
        year=$(echo "$year_month" | cut -d'-' -f1)
        month=$(echo "$year_month" | cut -d'-' -f2)
        month_name=$(get_month_name "$month")
        
        # Count commits for this committer in this month
        commit_count=$(grep "|$committer_email|.*|$year_month$" "$temp_dir/all_commits.txt" | wc -l)
        
        # Only add to CSV if there were commits in this month
        if [ "$commit_count" -gt 0 ]; then
            # Add to CSV report - properly escape values for CSV
            name_escaped=$(echo "$committer_name" | sed 's/"/""/g')
            email_escaped=$(echo "$committer_email" | sed 's/"/""/g')
            echo "$REPO_NAME,\"$name_escaped\",\"$email_escaped\",$year,\"$month_name\",$commit_count" >> "$OUTPUT_FILE"
        fi
        
    done < "$temp_dir/months.txt"
    
done < "$temp_dir/committers.txt"

# Clean up temporary files
rm -rf "$temp_dir"

echo "Report generation complete!"
echo "CSV report saved to: $OUTPUT_FILE"

# Optional: Show summary of months analyzed
echo "Time period analyzed: Last $DAYS_TO_ANALYZE days, covering months:"
cut -d',' -f4,5 "$OUTPUT_FILE" | sort -u | tail -n +2 | while read -r year_month; do
    echo "  $year_month"
done

# Optional: Display a sample of the report
echo "Report sample (first 10 entries):"
echo "--------------------------------"
head -n 11 "$OUTPUT_FILE" | column -t -s ','
