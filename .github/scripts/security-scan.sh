#!/bin/bash

# Security Scan Script for AcademiaStacks
# This script checks for hardcoded secrets while avoiding false positives

set -e

echo "🔍 Starting security scan..."

# Function to check for actual hardcoded secrets (not false positives)
check_hardcoded_secrets() {
    local directory=$1
    local name=$2
    
    echo "Scanning $name for hardcoded secrets..."
    
    # Check for actual hardcoded secrets with proper patterns
    # This looks for assignments like: password = "actualpassword123"
    # But excludes React props, form fields, and legitimate code patterns
    local secrets_found=false
    
    # Check for hardcoded password assignments (8+ characters)
    if grep -r -E "password\s*[:=]\s*['\"][^'\"]{8,}['\"]" "$directory" --exclude-dir=node_modules --exclude="*.json" --exclude="*.md" --exclude="*.pdf" --exclude="*.css" --exclude="*.png" --exclude="*.gif" --exclude="*.jpg" --exclude="*.jpeg" 2>/dev/null | grep -v "process.env" | grep -v "//.*password" | grep -v "type.*password" | grep -v "placeholder.*password" | grep -v "getAccessToken\|getRefreshToken" | grep -v "localStorage.getItem" | grep -v "Cookies.set\|Cookies.remove" | grep -v "newErrors.password" | grep -v "errors.password" | grep -v "Password is required" | grep -v "Password must" | grep -v "Invalid email or password"; then
        echo "❌ Found potential hardcoded passwords in $name"
        secrets_found=true
    fi
    
    # Check for hardcoded secret assignments (8+ characters)
    if grep -r -E "secret\s*[:=]\s*['\"][^'\"]{8,}['\"]" "$directory" --exclude-dir=node_modules --exclude="*.json" --exclude="*.md" --exclude="*.pdf" --exclude="*.css" --exclude="*.png" --exclude="*.gif" --exclude="*.jpg" --exclude="*.jpeg" 2>/dev/null | grep -v "process.env" | grep -v "//.*secret"; then
        echo "❌ Found potential hardcoded secrets in $name"
        secrets_found=true
    fi
    
    # Check for hardcoded API keys (8+ characters)
    if grep -r -E "(api_key|apikey)\s*[:=]\s*['\"][^'\"]{8,}['\"]" "$directory" --exclude-dir=node_modules --exclude="*.json" --exclude="*.md" --exclude="*.pdf" --exclude="*.css" --exclude="*.png" --exclude="*.gif" --exclude="*.jpg" --exclude="*.jpeg" 2>/dev/null | grep -v "process.env" | grep -v "REACT_APP_"; then
        echo "❌ Found potential hardcoded API keys in $name"
        secrets_found=true
    fi
    
    # Check for hardcoded tokens (8+ characters)
    if grep -r -E "token\s*[:=]\s*['\"][^'\"]{8,}['\"]" "$directory" --exclude-dir=node_modules --exclude="*.json" --exclude="*.md" --exclude="*.pdf" --exclude="*.css" --exclude="*.png" --exclude="*.gif" --exclude="*.jpg" --exclude="*.jpeg" 2>/dev/null | grep -v "process.env" | grep -v "//.*token" | grep -v "getAccessToken\|getRefreshToken" | grep -v "localStorage.getItem" | grep -v "Cookies.set\|Cookies.remove"; then
        echo "❌ Found potential hardcoded tokens in $name"
        secrets_found=true
    fi
    
    if [ "$secrets_found" = true ]; then
        echo "❌ Potential hardcoded secrets found in $name!"
        return 1
    else
        echo "✅ No hardcoded secrets found in $name"
        return 0
    fi
}

# Check API directory
check_hardcoded_secrets "api/" "API code"

# Check client directory
check_hardcoded_secrets "client/src/" "client code"

echo "✅ Security scan completed successfully!"
