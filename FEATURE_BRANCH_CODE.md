# Feature Branch Code - Có lỗi bảo mật

File này chứa code cho feature branch `feature/add-search-functionality` với các lỗ hổng bảo mật.

## Hướng dẫn apply

1. Tạo feature branch:
```bash
git checkout -b feature/add-search-functionality
```

2. Thay thế nội dung file `backend/routes/users.js` bằng code bên dưới

3. Commit và push:
```bash
git add backend/routes/users.js
git commit -m "feat: add user search functionality"
git push origin feature/add-search-functionality
```

4. Tạo Pull Request trên GitHub

## Code có lỗi (backend/routes/users.js)

```javascript
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

module.exports = (pool) => {
  // GET /api/users - Get all users
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT id, username, email, created_at FROM users ORDER BY created_at DESC');
      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      });
    }
  });

  // GET /api/users/:id - Get user by ID
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT id, username, email, created_at FROM users WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user'
      });
    }
  });

  // POST /api/users - Create new user
  router.post('/', async (req, res) => {
    try {
      const { username, email } = req.body;

      if (!username || !email) {
        return res.status(400).json({
          success: false,
          error: 'Username and email are required'
        });
      }

      const result = await pool.query(
        'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id, username, email, created_at',
        [username, email]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Check for duplicate key error
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          error: 'User with this username or email already exists'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create user'
      });
    }
  });

  // GET /api/users/search?q=keyword - Search users (NEW FEATURE WITH BUGS)
  router.get('/search', async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          error: 'Search query is required'
        });
      }

      // LỖI 1: Hardcoded credentials
      const searchPool = new Pool({
        host: 'localhost',
        port: 5432,
        user: 'testuser',
        password: 'testpass123', // HARDCODED PASSWORD - SECURITY ISSUE
        database: 'copilot_test'
      });

      // LỖI 2: SQL Injection vulnerability
      // Sử dụng string concatenation thay vì parameterized query
      const query = `SELECT id, username, email, created_at FROM users WHERE username LIKE '%${q}%' OR email LIKE '%${q}%'`;
      
      const result = await searchPool.query(query);

      // LỖI 3: API Response không đúng format
      // Thiếu field "success" và structure không đúng spec
      res.json({
        users: result.rows,
        count: result.rows.length
      });

      await searchPool.end();
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({
        error: 'Failed to search users'
      });
    }
  });

  return router;
};
```

## Các lỗ hổng bảo mật trong code

### Lỗi 1: Hardcoded Credentials ⚠️
- **Vị trí:** Dòng tạo Pool mới trong `/search` endpoint
- **Vấn đề:** Database password được hardcode trong code: `password: 'testpass123'`
- **Rủi ro:** Credentials có thể bị lộ khi code được commit lên repository

### Lỗi 2: SQL Injection ⚠️
- **Vị trí:** Search query trong `/search` endpoint
- **Vấn đề:** Sử dụng string concatenation: `` `...WHERE username LIKE '%${q}%'` ``
- **Rủi ro:** Attacker có thể inject malicious SQL code qua parameter `q`

**Ví dụ tấn công:**
```
GET /api/users/search?q=' OR '1'='1
```

### Lỗi 3: API Alignment Issue ⚠️
- **Vị trí:** Response của `/search` endpoint
- **Vấn đề:** 
  - Thiếu field `success: true/false`
  - Response structure khác với specification (`users`, `count` thay vì `data`)
- **Rủi ro:** Frontend có thể break vì expect format khác, không consistent với các endpoints khác

## Expected Copilot Findings

GitHub Copilot nên phát hiện:
1. ⚠️ Hardcoded password/credentials warning
2. ⚠️ SQL injection vulnerability alert
3. ⚠️ API response format inconsistency suggestion
