#!/bin/bash

# Script để apply feature branch code có lỗi bảo mật

echo "🚀 Applying feature branch code with security issues..."
echo ""

# Kiểm tra xem đã có git repo chưa
if [ ! -d ".git" ]; then
    echo "❌ Git repository chưa được khởi tạo"
    echo "   Chạy: git init"
    exit 1
fi

# Kiểm tra xem đã ở feature branch chưa
CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" != "feature/add-search-functionality" ]; then
    echo "📝 Creating feature branch: feature/add-search-functionality"
    git checkout -b feature/add-search-functionality 2>/dev/null || git checkout feature/add-search-functionality
else
    echo "✅ Already on feature branch: feature/add-search-functionality"
fi

# Copy code có lỗi vào users.js
if [ -f "backend/routes/users.feature.js" ]; then
    echo "📋 Copying feature branch code..."
    cp backend/routes/users.feature.js backend/routes/users.js
    echo "✅ Code applied successfully"
else
    echo "❌ File users.feature.js not found"
    exit 1
fi

echo ""
echo "📝 Code đã được apply với các lỗ hổng bảo mật:"
echo "   1. ⚠️  Hardcoded credentials (password)"
echo "   2. ⚠️  SQL injection vulnerability"
echo "   3. ⚠️  API response format không đúng spec"
echo ""
echo "Để commit và push:"
echo "   git add backend/routes/users.js"
echo "   git commit -m 'feat: add user search functionality'"
echo "   git push origin feature/add-search-functionality"
echo ""
echo "Sau đó tạo Pull Request trên GitHub để test Copilot review"
