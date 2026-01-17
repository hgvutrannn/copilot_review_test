# Setup Guide - Hướng dẫn thiết lập

## Bước 1: Setup Git Repository

```bash
# Khởi tạo git repo
git init
git add .
git commit -m "Initial commit: Base code (clean)"

# Tạo branch main (nếu chưa có)
git branch -M main

# Thêm remote (nếu có)
# git remote add origin <your-repo-url>
```

## Bước 2: Setup Database

```bash
# Khởi động PostgreSQL container
docker-compose up -d

# Kiểm tra container đang chạy
docker ps

# Xem logs nếu cần
docker-compose logs postgres
```

## Bước 3: Setup Backend

```bash
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env từ template
cp env.example .env

# Hoặc tạo thủ công file .env với nội dung:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=testuser
# DB_PASSWORD=testpass123
# DB_NAME=copilot_test
# PORT=3001

# Khởi tạo database (tạo tables)
npm run init-db

# Chạy server
npm start
# hoặc để development với auto-reload:
npm run dev
```

Backend sẽ chạy tại: http://localhost:3001

## Bước 4: Setup Frontend

```bash
# Mở terminal mới
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

## Bước 5: Verify Base Code (Giai đoạn 1)

1. Mở browser: http://localhost:3000
2. Test tạo user mới
3. Verify user được hiển thị trong list
4. Test API trực tiếp: http://localhost:3001/api/users
5. Verify không có lỗ hổng bảo mật trong code hiện tại

## Bước 6: Tạo Feature Branch với lỗi (Giai đoạn 2)

```bash
# Tạo và chuyển sang feature branch
git checkout -b feature/add-search-functionality

# Copy code có lỗi vào routes/users.js
# Xem hướng dẫn trong FEATURE_BRANCH_CODE.md
# Hoặc copy từ users.feature.js:
cp backend/routes/users.feature.js backend/routes/users.js

# Commit changes
git add backend/routes/users.js
git commit -m "feat: add user search functionality"

# Push branch lên remote
git push origin feature/add-search-functionality
```

## Bước 7: Test GitHub Copilot Review

1. Mở GitHub repository
2. Tạo Pull Request từ `feature/add-search-functionality` vào `main`
3. Enable GitHub Copilot Security Review (nếu có)
4. Xem kết quả review:
   - Hardcoded credentials warning
   - SQL injection vulnerability
   - API response format inconsistency

## Troubleshooting

### Database connection error
```bash
# Kiểm tra PostgreSQL đang chạy
docker ps

# Restart container nếu cần
docker-compose restart postgres

# Xem logs để debug
docker-compose logs postgres
```

### Port already in use
- Backend: Thay đổi PORT trong `.env` file
- Frontend: Chọn port khác khi prompt
- PostgreSQL: Thay đổi port mapping trong `docker-compose.yml`

### npm install errors
```bash
# Clear cache và thử lại
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Testing API endpoints

### Test với curl:

```bash
# Health check
curl http://localhost:3001/health

# Get all users
curl http://localhost:3001/api/users

# Get user by ID
curl http://localhost:3001/api/users/1

# Create user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com"}'

# Search users (sau khi apply feature branch)
curl "http://localhost:3001/api/users/search?q=test"
```

## Clean up

```bash
# Dừng và xóa containers
docker-compose down

# Xóa volumes (sẽ xóa data)
docker-compose down -v
```
