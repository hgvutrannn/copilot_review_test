# Copilot Security Test Project

Project này được tạo để test khả năng phát hiện lỗ hổng bảo mật của GitHub Copilot khi review Pull Requests.

## Tech Stack
- **Backend:** Node.js + Express + PostgreSQL
- **Frontend:** React
- **Database:** PostgreSQL (Docker)

## Cấu trúc Project

```
copilot_review_test/
├── backend/           # Express API server
│   ├── routes/        # API routes
│   ├── scripts/       # Database initialization
│   └── server.js      # Entry point
├── frontend/          # React application
│   ├── src/
│   └── public/
├── docker-compose.yml # PostgreSQL setup
├── TEST_PLAN.md       # Chi tiết kế hoạch test
└── API_SPECIFICATION.md # API documentation
```

## Setup

### 1. Khởi động PostgreSQL

```bash
docker-compose up -d
```

### 2. Setup Backend

```bash
cd backend
npm install
cp env.example .env
npm run init-db  # Khởi tạo database và tables
npm start        # Hoặc npm run dev để chạy với nodemon
```

**Lưu ý:** Nếu file `.env` đã tồn tại, kiểm tra nội dung phù hợp với `env.example`

Backend sẽ chạy tại: http://localhost:3001

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

## Test Plan

Xem chi tiết tại [TEST_PLAN.md](./TEST_PLAN.md)

### Giai đoạn 1: Base Code (Clean)
- Branch `main` - Code hoàn toàn sạch, không có lỗ hổng

### Giai đoạn 2: Feature Branch (Có lỗi)
- Branch `feature/add-search-functionality` - Có 3 lỗ hổng:
  1. Hardcoded credentials
  2. SQL injection
  3. API alignment issues

## API Endpoints

Xem chi tiết tại [API_SPECIFICATION.md](./API_SPECIFICATION.md)

- `GET /health` - Health check
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user

## Quick Start - Tạo Feature Branch với lỗi

Sau khi setup base code (main branch), để test với feature branch có lỗi:

```bash
# Cách 1: Sử dụng script helper
./apply-feature-branch.sh

# Cách 2: Thủ công
git checkout -b feature/add-search-functionality
cp backend/routes/users.feature.js backend/routes/users.js
git add backend/routes/users.js
git commit -m "feat: add user search functionality"
git push origin feature/add-search-functionality
```

Xem chi tiết tại:
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Hướng dẫn setup chi tiết
- [FEATURE_BRANCH_CODE.md](./FEATURE_BRANCH_CODE.md) - Chi tiết về code có lỗi
- [TEST_PLAN.md](./TEST_PLAN.md) - Kế hoạch test đầy đủ

## Lưu ý

Project này được tạo với mục đích test security review của GitHub Copilot. Các lỗ hổng bảo mật trong feature branch là cố ý để kiểm tra khả năng phát hiện của Copilot.
