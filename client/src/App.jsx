import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // Lấy dữ liệu từ server khi mới mở web
  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5001/tasks");
      setTasks(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!input) return;
    try {
      await axios.post("http://localhost:5001/tasks", { name: input });
      setInput("");
      getTasks(); // Tải lại danh sách
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/tasks/${id}`);
      getTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Check check task</h1>
      <form onSubmit={addTask}>
        <input 
          type="text" 
          placeholder="Hôm nay làm gì nè..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Thêm</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span>{task.name}</span>
            <button onClick={() => deleteTask(task.id)} className="delete-btn">Xong!</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;