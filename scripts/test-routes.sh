#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000/api"
PASSED=0
FAILED=0

# Helper functions
print_test() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
    ((PASSED++))
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    ((FAILED++))
}

print_section() {
    echo ""
    echo -e "${YELLOW}=== $1 ===${NC}"
    echo ""
}

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    print_test "$description"
    
    if [ -z "$data" ]; then
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -w "\n%{http_code}")
    else
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" \
            -w "\n%{http_code}")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    echo "Response Code: $http_code"
    echo "Response: $(echo $body | jq '.' 2>/dev/null || echo $body)"
    echo ""
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        print_success "HTTP $http_code"
    elif [ "$http_code" -ge 400 ] && [ "$http_code" -lt 500 ]; then
        print_success "HTTP $http_code (Expected error response)"
    else
        print_error "HTTP $http_code"
    fi
    echo ""
}

print_section "PERMISSIONS ENDPOINTS"

# Get all permissions
test_endpoint "GET" "/admin/permissions" "" "Get all permissions"

# Get permission stats
test_endpoint "GET" "/admin/permissions/stats" "" "Get permission stats"

# Get unique actions
test_endpoint "GET" "/admin/permissions/actions" "" "Get unique actions"

# Get unique resources
test_endpoint "GET" "/admin/permissions/resources" "" "Get unique resources"

# Get action-resource map
test_endpoint "GET" "/admin/permissions/map" "" "Get action-resource mapping"

print_section "ROLES ENDPOINTS"

# Get all roles
test_endpoint "GET" "/admin/roles" "" "Get all roles"

# Get role stats
test_endpoint "GET" "/admin/roles/stats" "" "Get role stats"

# Get role by name
test_endpoint "GET" "/admin/roles/name/admin" "" "Get role by name (admin)"

# Get role permissions
test_endpoint "GET" "/admin/roles?includeInactive=false" "" "Get roles with filter"

print_section "USERS ENDPOINTS"

# Get all users
test_endpoint "GET" "/admin/users" "" "Get all users"

# Get user stats
test_endpoint "GET" "/admin/users/stats" "" "Get user stats"

# Get specific user (need to get ID first)
print_test "Getting first user ID..."
response=$(curl -s -X GET "$BASE_URL/admin/users?page=1&pageSize=1" \
    -H "Content-Type: application/json")
user_id=$(echo $response | jq -r '.data[0].id' 2>/dev/null)

if [ ! -z "$user_id" ] && [ "$user_id" != "null" ]; then
    print_success "Found user ID: $user_id"
    test_endpoint "GET" "/admin/users/$user_id" "" "Get user by ID"
else
    print_error "Could not get user ID"
fi

echo ""

# Get current user profile (public endpoint)
test_endpoint "GET" "/users/me" "" "Get current user profile"

print_section "CREATE ENDPOINTS"

# Create permission
permission_data='{
    "action": "approve",
    "resource": "posts",
    "description": "Approve posts for publication"
}'
test_endpoint "POST" "/admin/permissions" "$permission_data" "Create permission"

# Create role
role_data='{
    "name": "editor",
    "description": "Editor role for content",
    "permissions": []
}'
test_endpoint "POST" "/admin/roles" "$role_data" "Create role"

# Create user
user_data='{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "roles": []
}'
test_endpoint "POST" "/admin/users" "$user_data" "Create user"

print_section "UPDATE ENDPOINTS"

if [ ! -z "$user_id" ] && [ "$user_id" != "null" ]; then
    # Update user
    update_data='{
        "username": "updated_user",
        "isActive": true
    }'
    test_endpoint "PATCH" "/admin/users/$user_id" "$update_data" "Update user"
fi

print_section "ROLE MANAGEMENT ENDPOINTS"

# Get role to extract ID
print_test "Getting role IDs..."
response=$(curl -s -X GET "$BASE_URL/admin/roles?page=1&pageSize=1" \
    -H "Content-Type: application/json")
role_id=$(echo $response | jq -r '.data[0].id' 2>/dev/null)

if [ ! -z "$role_id" ] && [ "$role_id" != "null" ]; then
    print_success "Found role ID: $role_id"
    
    # Get role permissions
    test_endpoint "GET" "/admin/roles/$role_id/permissions" "" "Get role permissions"
    
    # Get role by ID
    test_endpoint "GET" "/admin/roles/$role_id" "" "Get role by ID"
    
    # Check if role has permission
    perm_check='{
        "permissionId": "'$(echo $response | jq -r '.data[0].permissions[0]' 2>/dev/null)'"
    }'
    test_endpoint "POST" "/admin/roles/$role_id/permissions/check" "$perm_check" "Check role permission"
else
    print_error "Could not get role ID"
fi

print_section "SOFT DELETE & RESTORE ENDPOINTS"

if [ ! -z "$user_id" ] && [ "$user_id" != "null" ]; then
    # Soft delete user
    test_endpoint "DELETE" "/admin/users/$user_id" "" "Soft delete user"
    
    # Restore user
    test_endpoint "POST" "/admin/users/$user_id/restore" "" "Restore user"
fi

print_section "USER ROLE MANAGEMENT"

if [ ! -z "$user_id" ] && [ "$user_id" != "null" ]; then
    # Assign roles
    assign_data='{
        "roles": []
    }'
    test_endpoint "POST" "/admin/users/$user_id/roles/assign" "$assign_data" "Assign roles to user"
    
    # Verify email
    test_endpoint "POST" "/admin/users/$user_id/verify-email" "" "Verify user email"
    
    # Update last login
    test_endpoint "POST" "/admin/users/$user_id/last-login" "" "Update last login"
fi

print_section "PERMISSION OPERATIONS"

# Get permission by action and resource
test_endpoint "GET" "/admin/permissions/create/users" "" "Get permission by action/resource"

# Get permissions by action
test_endpoint "GET" "/admin/permissions/action/create" "" "Get permissions by action"

# Get permissions by resource
test_endpoint "GET" "/admin/permissions/resource/users" "" "Get permissions by resource"

# Bulk create permissions
bulk_perms='{
    "permissions": [
        {
            "action": "archive",
            "resource": "reports",
            "description": "Archive reports"
        },
        {
            "action": "publish",
            "resource": "reports",
            "description": "Publish report generation"
        }
    ]
}'
test_endpoint "POST" "/admin/permissions/bulk" "$bulk_perms" "Bulk create permissions"

print_section "TEST SUMMARY"
total=$((PASSED + FAILED))
echo -e "${BLUE}Total Tests: $total${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
