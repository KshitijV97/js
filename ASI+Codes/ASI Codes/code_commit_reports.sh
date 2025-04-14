#!/bin/bash

# Bitbucket Code Commit Report Generator
# This script generates a CSV report of commits for all repositories in a Bitbucket project
# It includes:
#  - Number of code committers
#  - Commits per committer
#  - Peer review status
#
# Requirements:
#   - curl: for making API requests
#   - jq: for parsing JSON responses

# ===== Configuration Variables (EDIT THESE) =====
BITBUCKET_URL="https://bitbucket.example.com"  # Your Bitbucket server URL
PROJECT_KEY="PROJ"                            # The Bitbucket project key
USERNAME="username"                           # Your Bitbucket username
PASSWORD="password"                           # Your Bitbucket password/token
OUTPUT_FILE="commit_report.csv"               # Output file name

# Alternative authentication with token (more secure)
# Uncomment these lines and comment out the USERNAME/PASSWORD above if using a token
# TOKEN="your_access_token"
# AUTH_HEADER="Authorization: Bearer $TOKEN"

# ===== Validation =====
# Check for required tools
command -v curl >/dev/null 2>&1 || { echo "Error: curl is required but not installed. Aborting."; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "Error: jq is required but not installed. Aborting."; exit 1; }

# ===== Initialize CSV File =====
echo "Repository,Committer Name,Committer Email,Commit Count,Peer Reviewed Commits,Peer Review Percentage" > "$OUTPUT_FILE"

# ===== Helper Functions =====
# Function to fetch all pages of paginated API responses
fetch_all_pages() {
    local base_url=$1
    local start=0
    local limit=100
    local all_values="[]"
    local response
    local is_last_page
    
    # Check if URL already has query parameters
    if [[ "$base_url" == *"?"* ]]; then
        separator="&"
    else
        separator="?"
    fi
    
    while true; do
        # Construct URL with pagination parameters
        url="${base_url}${separator}start=${start}&limit=${limit}"
        
        # Make API call with appropriate authentication
        if [ -n "$TOKEN" ]; then
            response=$(curl -s -H "$AUTH_HEADER" "$url")
        else
            response=$(curl -s -u "$USERNAME:$PASSWORD" "$url")
        fi
        
        # Check for errors in the response
        if echo "$response" | jq -e '.errors' > /dev/null 2>&1; then
            echo "Error in API call to $url:" >&2
            echo "$response" | jq '.errors[] | .message' >&2
            return 1
        fi
        
        # Extract values from current page and add to our collection
        values=$(echo "$response" | jq '.values')
        all_values=$(echo "$all_values" | jq -c ". + $values")
        
        # Check if we've reached the last page
        is_last_page=$(echo "$response" | jq '.isLastPage')
        if [ "$is_last_page" = "true" ]; then
            break
        fi
        
        # Get the start parameter for the next page
        start=$(echo "$response" | jq '.nextPageStart')
    done
    
    echo "$all_values"
}

# ===== Main Script =====
echo "Starting Bitbucket commit report generation..."
echo "Fetching repositories in project $PROJECT_KEY..."

# Get all repositories in the project
repos=$(fetch_all_pages "$BITBUCKET_URL/rest/api/1.0/projects/$PROJECT_KEY/repos")
repo_count=$(echo "$repos" | jq '. | length')
echo "Found $repo_count repositories"

# Process each repository
echo "$repos" | jq -r '.[] | .slug' | while read -r repo; do
    echo "Processing repository: $repo"
    
    # Create a temporary directory for processing
    temp_dir=$(mktemp -d)
    
    # Get all commits on master branch
    echo "  Fetching commits from master branch..."
    commits=$(fetch_all_pages "$BITBUCKET_URL/rest/api/1.0/projects/$PROJECT_KEY/repos/$repo/commits?until=refs%2Fheads%2Fmaster")
    
    # Get all merged pull requests (these represent peer-reviewed code)
    echo "  Fetching merged pull requests..."
    pull_requests=$(fetch_all_pages "$BITBUCKET_URL/rest/api/1.0/projects/$PROJECT_KEY/repos/$repo/pull-requests?state=MERGED")
    
    # Build lookup table for peer-reviewed commits
    echo "  Building peer review lookup table..."
    
    # Initialize empty file
    > "$temp_dir/reviewed_commits.txt"
    
    # Get commits from each merged pull request
    echo "$pull_requests" | jq -r '.[] | .id' | while read -r pr_id; do
        pr_commits=$(fetch_all_pages "$BITBUCKET_URL/rest/api/1.0/projects/$PROJECT_KEY/repos/$repo/pull-requests/$pr_id/commits")
        echo "$pr_commits" | jq -r '.[] | .id' >> "$temp_dir/reviewed_commits.txt"
    done
    
    # Sort and deduplicate for faster searching
    if [ -s "$temp_dir/reviewed_commits.txt" ]; then
        sort "$temp_dir/reviewed_commits.txt" | uniq > "$temp_dir/reviewed_commits_unique.txt"
    else
        > "$temp_dir/reviewed_commits_unique.txt"
    fi
    
    # Process commit data
    echo "  Analyzing commit data..."
    echo "$commits" | jq -r '.[] | "\(.author.emailAddress)|\(.author.name)|\(.id)"' > "$temp_dir/all_commits.txt"
    
    # Get unique committers
    cut -d'|' -f1 "$temp_dir/all_commits.txt" | sort | uniq > "$temp_dir/committers.txt"
    committer_count=$(wc -l < "$temp_dir/committers.txt")
    echo "  Found $committer_count unique committers"
    
    # Process each committer
    echo "  Generating commit statistics..."
    while read -r committer; do
        # Get committer name
        name=$(grep "^$committer|" "$temp_dir/all_commits.txt" | head -1 | cut -d'|' -f2)
        
        # Count total commits and reviewed commits
        commit_count=0
        reviewed_count=0
        
        while read -r line; do
            commit_id=$(echo "$line" | cut -d'|' -f3)
            ((commit_count++))
            
            # Check if commit was peer reviewed (part of a pull request)
            if grep -q "^$commit_id$" "$temp_dir/reviewed_commits_unique.txt"; then
                ((reviewed_count++))
            fi
        done < <(grep "^$committer|" "$temp_dir/all_commits.txt")
        
        # Calculate peer review percentage
        if [ "$commit_count" -gt 0 ]; then
            review_percentage=$(awk "BEGIN { printf \"%.2f\", ($reviewed_count / $commit_count) * 100 }")
        else
            review_percentage="0.00"
        fi
        
        # Add to CSV report
        echo "$repo,\"$name\",\"$committer\",$commit_count,$reviewed_count,$review_percentage%" >> "$OUTPUT_FILE"
        
    done < "$temp_dir/committers.txt"
    
    # Clean up temporary files
    rm -rf "$temp_dir"
done

echo "Report generation complete!"
echo "CSV report saved to: $OUTPUT_FILE"
