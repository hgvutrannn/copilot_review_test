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
