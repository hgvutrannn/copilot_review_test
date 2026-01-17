const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối Database
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "matkhaubimat", // Mật khẩu lúc nãy đặt trong Docker
  port: 5432,
});

// Tạo bảng dữ liệu nếu chưa có
pool.query(
  "CREATE TABLE IF NOT EXISTS tasks (id SERIAL PRIMARY KEY, name TEXT, is_done BOOLEAN DEFAULT false)",
  (err, res) => {
    if (err) console.log(err);
    else console.log("Database đã sẵn sàng!");
  }
);

// Lấy danh sách task
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Thêm task mới
app.post("/tasks", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Tên task là bắt buộc" });
    }
    const newTodo = await pool.query(
      "INSERT INTO tasks (name) VALUES($1) RETURNING *",
      [name]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Xóa task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json("Đã xóa!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5001, () => {
  console.log("Server đang chạy ở cổng 5001");
});