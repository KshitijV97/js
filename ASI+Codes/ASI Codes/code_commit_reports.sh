#!/bin/bash

# Bitbucket Code Commit Report Generator - Access Token Version
# This script generates a CSV report of commits for all repositories in a Bitbucket project
# using a Bitbucket access token for authentication.
#
# The report includes:
#  - Number of code committers
#  - Commits per committer
#  - Peer review status

# ===== Configuration Variables (EDIT THESE) =====
BITBUCKET_URL="https://bitbucket.example.com"  # Your Bitbucket server URL
PROJECT_KEY="PROJ"                            # The Bitbucket project key
ACCESS_TOKEN="your_access_token_here"         # Your Bitbucket access token
OUTPUT_FILE="commit_report.csv"               # Output file name
DEBUG_MODE=true                               # Set to true to enable debugging

# ===== Validation =====
# Check for required tools
command -v curl >/dev/null 2>&1 || { echo "Error: curl is required but not installed. Aborting."; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "Error: jq is required but not installed. Aborting."; exit 1; }

# ===== Initialize CSV File =====
echo "Repository,Committer Name,Committer Email,Commit Count,Peer Reviewed Commits,Peer Review Percentage" > "$OUTPUT_FILE"

# ===== Debug Functions =====
debug_log() {
    if [ "$DEBUG_MODE" = true ]; then
        echo "[DEBUG] $1" >&2
    fi
}

# Function to test API connection and authentication
test_connection() {
    debug_log "Testing connection to Bitbucket API with access token..."
    
    # Make a simple API call to test connection
    local test_url="$BITBUCKET_URL/rest/api/1.0/projects/$PROJECT_KEY"
    local response
    local http_code
    
    # Get both the response body and HTTP status code
    response=$(curl -s -w "\n%{http_code}" \
                   -H "Authorization: Bearer $ACCESS_TOKEN" \
                   "$test_url")
    
    # Extract status code from the last line
    http_code=$(echo "$response" | tail -n1)
    # Extract response body (everything except the last line)
    local body=$(echo "$response" | sed '$d')
    
    debug_log "HTTP Status Code: $http_code"
    
    if [[ "$http_code" == "2"* ]]; then
        debug_log "Connection test successful"
        # Test if the response is valid JSON
        if ! echo "$body" | jq . >/dev/null 2>&1; then
            echo "Warning: API returned success code but response is not valid JSON"
            echo "Response body sample:"
            echo "$body" | head -c 500
            echo "..."
            return 1
        fi
        return 0
    elif [[ "$http_code" == "401" ]]; then
        echo "Error: Authentication failed. Please check your access token."
        echo "Response body sample:"
        echo "$body" | head -c 500
        echo "..."
        return 1
    elif [[ "$http_code" == "404" ]]; then
        echo "Error: Project '$PROJECT_KEY' not found. Please check your project key."
        return 1
    else
        echo "Error: Connection to Bitbucket API failed with status code $http_code"
        echo "Response body sample:"
        echo "$body" | head -c 500
        echo "..."
        return 1
    fi
}

# ===== Helper Functions =====
# Function to fetch data from an API endpoint with safe JSON parsing
safe_api_call() {
    local url=$1
    local output_file=$(mktemp)
    local http_code
    
    debug_log "Making API call to: $url"
    
    # Make the API call using access token and capture both response and status code
    response=$(curl -s -w "\n%{http_code}" \
                   -H "Authorization: Bearer $ACCESS_TOKEN" \
                   "$url")
    
    # Extract status code from the last line
    http_code=$(echo "$response" | tail -n1)
    # Extract response body (everything except the last line)
    local body=$(echo "$response" | sed '$d')
    
    debug_log "HTTP Status Code: $http_code"
    
    if [[ "$http_code" == "2"* ]]; then
        # Success - check if response is valid JSON
        if echo "$body" | jq . >/dev/null 2>&1; then
            echo "$body"
            return 0
        else
            debug_log "API returned non-JSON response"
            if [ "$DEBUG_MODE" = true ]; then
                echo "Response body sample:" >&2
                echo "$body" | head -c 500 >&2
                echo "..." >&2
            fi
            return 1
        fi
    else
        echo "Error: API call failed with status code $http_code" >&2
        if [ "$DEBUG_MODE" = true ]; then
            echo "Response body sample:" >&2
            echo "$body" | head -c 500 >&2
            echo "..." >&2
        fi
        return 1
    fi
}

# Function to safely parse JSON with jq
safe_jq_parse() {
    local json=$1
    local jq_filter=$2
    local result
    
    # Check if input is valid JSON
    if ! echo "$json" | jq . >/dev/null 2>&1; then
        debug_log "Invalid JSON input to jq parser"
        if [ "$DEBUG_MODE" = true ]; then
            echo "JSON sample:" >&2
            echo "$json" | head -c 500 >&2
            echo "..." >&2
        fi
        return 1
    fi
    
    # Apply jq filter
    result=$(echo "$json" | jq -r "$jq_filter" 2>/dev/null)
    if [ $? -ne 0 ]; then
        debug_log "jq filter failed: $jq_filter"
        return 1
    fi
    
    echo "$result"
    return 0
}

# Function to fetch all pages of paginated API responses
fetch_all_pages() {
    local base_url=$1
    local all_values="[]"
    local start=0
    local limit=100
    local response
    local is_last_page
    local values
    
    # Check if URL already has query parameters
    if [[ "$base_url" == *"?"* ]]; then
        separator="&"
    else
        separator="?"
    fi
    
    debug_log "Fetching all pages from: $base_url"
    
    # Create a temp file to accumulate results
    local temp_file=$(mktemp)
    echo "[]" > "$temp_file"
    
    while true; do
        # Construct URL with pagination parameters
        local url="${base_url}${separator}start=${start}&limit=${limit}"
        
        # Make API call
        response=$(safe_api_call "$url")
        if [ $? -ne 0 ]; then
            echo "Error fetching data from $url" >&2
            rm -f "$temp_file"
            return 1
        fi
        
        # Extract values from current page
        values=$(safe_jq_parse "$response" '.values')
        if [ $? -ne 0 ]; then
            echo "Error parsing values from response" >&2
            rm -f "$temp_file"
            return 1
        fi
        
        # Merge with existing values
        local combined=$(cat "$temp_file" | jq -c ". + $values")
        echo "$combined" > "$temp_file"
        
        # Check if we've reached the last page
        is_last_page=$(safe_jq_parse "$response" '.isLastPage')
        if [ "$is_last_page" = "true" ]; then
            break
        fi
        
        # Get the start parameter for the next page
        start=$(safe_jq_parse "$response" '.nextPageStart')
        debug_log "Fetching next page starting at: $start"
    done
    
    # Return accumulated values
    cat "$temp_file"
    rm -f "$temp_file"
}

# ===== Main Script =====
echo "Starting Bitbucket commit report generation..."

# Test connection to Bitbucket before proceeding
if ! test_connection; then
    echo "Connection test failed. Please check your access token and configuration and try again."
    exit 1
fi

echo "Fetching repositories in project $PROJECT_KEY..."

# Get all repositories in the project
repos=$(fetch_all_pages "$BITBUCKET_URL/rest/api/1.0/projects/$PROJECT_KEY/repos")
if [ $? -ne 0 ]; then
    echo "Failed to fetch repositories. Aborting."
    exit 1
fi

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
    if [ $? -ne 0 ]; then
        echo "  Failed to fetch commits for $repo. Skipping this repository."
        rm -rf "$temp_dir"
        continue
    fi
    
    # Get all merged pull requests (these represent peer-reviewed code)
    echo "  Fetching merged pull requests..."
    pull_requests=$(fetch_all_pages "$BITBUCKET_URL/rest/api/1.0/projects/$PROJECT_KEY/repos/$repo/pull-requests?state=MERGED")
    if [ $? -ne 0 ]; then
        echo "  Failed to fetch pull requests for $repo. Continuing with limited data."
        # Continue with empty pull requests data
        pull_requests="[]"
    fi
    
    # Build lookup table for peer-reviewed commits
    echo "  Building peer review lookup table..."
    
    # Initialize empty file
    > "$temp_dir/reviewed_commits.txt"
    
    # Get commits from each merged pull request
    echo "$pull_requests" | jq -r '.[] | .id' | while read -r pr_id; do
        if [ -z "$pr_id" ] || [ "$pr_id" = "null" ]; then
            continue
        fi
        
        pr_commits=$(fetch_all_pages "$BITBUCKET_URL/rest/api/1.0/projects/$PROJECT_KEY/repos/$repo/pull-requests/$pr_id/commits")
        if [ $? -ne 0 ]; then
            debug_log "  Failed to fetch commits for PR $pr_id. Skipping this PR."
            continue
        fi
        
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
    if ! echo "$commits" | jq -r '.[] | "\(.author.emailAddress)|\(.author.name)|\(.id)"' > "$temp_dir/all_commits.txt"; then
        debug_log "  Error processing commit data for $repo."
        cat << EOF > "$temp_dir/all_commits.txt"
unknown@example.com|Unknown|unknown
EOF
    fi
    
    # Get unique committers
    cut -d'|' -f1 "$temp_dir/all_commits.txt" | sort | uniq > "$temp_dir/committers.txt"
    committer_count=$(wc -l < "$temp_dir/committers.txt")
    echo "  Found $committer_count unique committers"
    
    # Process each committer
    echo "  Generating commit statistics..."
    while read -r committer; do
        if [ -z "$committer" ] || [ "$committer" = "null" ]; then
            continue
        fi
        
        # Get committer name
        name=$(grep "^$committer|" "$temp_dir/all_commits.txt" | head -1 | cut -d'|' -f2)
        if [ -z "$name" ]; then
            name="Unknown"
        fi
        
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
        
        # Add to CSV report - properly escape values for CSV
        name_escaped=$(echo "$name" | sed 's/"/""/g')
        committer_escaped=$(echo "$committer" | sed 's/"/""/g')
        echo "$repo,\"$name_escaped\",\"$committer_escaped\",$commit_count,$reviewed_count,$review_percentage%" >> "$OUTPUT_FILE"
        
    done < "$temp_dir/committers.txt"
    
    # Clean up temporary files
    rm -rf "$temp_dir"
done

echo "Report generation complete!"
echo "CSV report saved to: $OUTPUT_FILE"
