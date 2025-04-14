#!/bin/bash

# Improved Bitbucket Code Commit Report Generator
# This script has enhanced error handling and debugging capabilities
# to help diagnose and fix jq parsing errors

# ===== Configuration Variables (EDIT THESE) =====
BITBUCKET_URL="https://bitbucket.example.com"  # Your Bitbucket server URL
PROJECT_KEY="PROJ"                            # The Bitbucket project key
USERNAME="username"                           # Your Bitbucket username
PASSWORD="password"                           # Your Bitbucket password/token
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
    debug_log "Testing connection to Bitbucket API..."
    
    # Make a simple API call to test connection
    local test_url="$BITBUCKET_URL/rest/api/1.0/projects/$PROJECT_KEY"
    local response
    local http_code
    
    # Get both the response body and HTTP status code
    response=$(curl -s -w "\n%{http_code}" -u "$USERNAME:$PASSWORD" "$test_url")
    
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
            e
