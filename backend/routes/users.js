const express = require('express');
const router = express.Router();

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

  return router;
};
