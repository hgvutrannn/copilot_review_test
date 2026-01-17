# Test Plan: GitHub Copilot Security Review

## Mục tiêu
Test khả năng phát hiện lỗ hổng bảo mật của GitHub Copilot khi review Pull Request:
1. **Hardcoded Credentials** - Mật khẩu, API keys được hardcode trong code
2. **SQL Injection** - Queries không sử dụng parameterized statements
3. **API Alignment Issues** - Response format không đúng với specification

## Kịch bản Test

### Giai đoạn 1: Base Code (Clean) ✅
**Branch:** `main`

- Codebase cơ bản hoàn chỉnh và an toàn
- Sử dụng environment variables cho credentials
- Tất cả queries đều parameterized (prepared statements)
- API responses đúng format theo specification
- Không có lỗ hổng bảo mật

**Kiểm tra:**
- ✅ Không có hardcoded credentials
- ✅ Tất cả SQL queries an toàn
- ✅ API responses đúng format

### Giai đoạn 2: Feature Branch (Có lỗi) ⚠️
**Branch:** `feature/add-search-functionality`

Thêm tính năng search users nhưng có 3 lỗ hổng bảo mật:

#### Lỗi 1: Hardcoded Credentials
- **File:** `backend/routes/users.js`
- **Vấn đề:** Hardcode database password trong code
- **Vị trí:** Trong function mới `searchUsers`

#### Lỗi 2: SQL Injection
- **File:** `backend/routes/users.js`
- **Vấn đề:** Search query sử dụng string concatenation thay vì parameterized query
- **Vị trí:** Function `searchUsers` với input từ user

#### Lỗi 3: API Alignment Issue
- **File:** `backend/routes/users.js`
- **Vấn đề:** Response format không đúng specification
  - Thiếu field `success`
  - Response structure khác với spec
- **Vị trí:** Search endpoint response

## Các bước thực hiện Test

### 1. Setup Base Code (Giai đoạn 1)

```bash
# Clone/checkout branch main
git checkout main

# Start PostgreSQL
docker-compose up -d

# Setup backend
cd backend
npm install
cp .env.example .env
npm run init-db
npm start

# Setup frontend (terminal mới)
cd frontend
npm install
npm start
```

### 2. Verify Base Code (Clean)
- Test API endpoints
- Verify không có hardcoded credentials
- Verify tất cả queries an toàn
- Verify API responses đúng format

### 3. Create Feature Branch với lỗi (Giai đoạn 2)

```bash
git checkout -b feature/add-search-functionality
```

- Thêm code với 3 lỗ hổng bảo mật (sẽ được tạo trong feature branch)
- Commit changes
- Push và tạo Pull Request

### 4. Test GitHub Copilot Review
- Mở Pull Request trên GitHub
- Enable GitHub Copilot Security Review
- Kiểm tra xem Copilot có phát hiện:
  - ✅ Hardcoded password
  - ✅ SQL injection vulnerability
  - ✅ API response format không đúng spec

## Kết quả mong đợi

GitHub Copilot nên phát hiện:
1. ⚠️ **Hardcoded Credentials:** Warning về hardcoded password trong code
2. ⚠️ **SQL Injection:** Alert về potential SQL injection trong search query
3. ⚠️ **API Alignment:** Suggestion về response format không đúng specification

## Files để Review

### Giai đoạn 1 (Clean):
- `backend/server.js` - Setup cơ bản, sử dụng env variables
- `backend/routes/users.js` - Routes an toàn với parameterized queries
- `API_SPECIFICATION.md` - Document specification

### Giai đoạn 2 (Có lỗi):
- `backend/routes/users.js` - Có thêm search endpoint với lỗi
- Frontend có thể cần update để gọi search API

## Ghi chú

- Đảm bảo base code (main branch) hoàn toàn clean và an toàn
- Feature branch chỉ thêm code mới, không sửa code cũ
- Lỗi phải rõ ràng và dễ phát hiện để test hiệu quả của Copilot
