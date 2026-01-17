# Quick Start Guide

Hướng dẫn nhanh để test GitHub Copilot Security Review.

## 🎯 Mục tiêu

Test khả năng phát hiện 3 loại lỗ hổng bảo mật:
1. **Hardcoded Credentials** - Password được hardcode
2. **SQL Injection** - Query không parameterized
3. **API Alignment** - Response format không đúng spec

## ⚡ Setup nhanh (5 phút)

### 1. Setup Database
```bash
docker-compose up -d
```

### 2. Setup Backend
```bash
cd backend
npm install
cp env.example .env
npm run init-db
npm start
```

### 3. Setup Frontend (terminal mới)
```bash
cd frontend
npm install
npm start
```

### 4. Verify Base Code
- Mở http://localhost:3000
- Tạo user mới, verify không có lỗi

## 🧪 Test Copilot Review

### Giai đoạn 1: Base Code (Clean) ✅
```bash
git init
git add .
git commit -m "Initial commit: Base code (clean)"
git branch -M main
```

**Verify:** Code sạch, không có lỗ hổng

### Giai đoạn 2: Feature Branch (Có lỗi) ⚠️
```bash
./apply-feature-branch.sh
git add backend/routes/users.js
git commit -m "feat: add user search functionality"
git push origin feature/add-search-functionality
```

**Tạo Pull Request trên GitHub**

## 📋 Checklist các lỗi trong Feature Branch

Feature branch (`feature/add-search-functionality`) có thêm endpoint `/api/users/search` với:

- [ ] ❌ **Lỗi 1:** Hardcoded password `'testpass123'` trong code
- [ ] ❌ **Lỗi 2:** SQL injection - query: `` `...LIKE '%${q}%'` `` 
- [ ] ❌ **Lỗi 3:** API response thiếu `success` field, structure khác spec

## ✅ Kết quả mong đợi từ Copilot

Khi review Pull Request, GitHub Copilot nên phát hiện:

1. ⚠️ **Security Warning:** Hardcoded credentials detected
2. ⚠️ **SQL Injection Alert:** Potential SQL injection vulnerability
3. ⚠️ **API Consistency:** Response format doesn't match specification

## 📚 Tài liệu chi tiết

- [TEST_PLAN.md](./TEST_PLAN.md) - Kế hoạch test đầy đủ
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Hướng dẫn setup chi tiết
- [FEATURE_BRANCH_CODE.md](./FEATURE_BRANCH_CODE.md) - Phân tích code có lỗi
- [API_SPECIFICATION.md](./API_SPECIFICATION.md) - API documentation

## 🐛 Troubleshooting

**Database connection error?**
```bash
docker-compose restart postgres
```

**Port already in use?**
- Backend: Đổi PORT trong `.env`
- Frontend: Chọn port khác khi prompt

**npm install fails?**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```
