// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  scanTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./dynamo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    scanTodos().then(setTodos);
  }, []);

  const handleAdd = async () => {
    if (!text.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    await createTodo(newItem);
    setTodos((prev) => [...prev, newItem]);
    setText("");
  };

  const handleToggle = async (id, current) => {
    await updateTodo(id, { completed: !current });
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !current } : t
      )
    );
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Todo App</h1>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New todo"
        style={{ marginRight: 8 }}
      />
      <button onClick={handleAdd}>Add</button>

      <ul style={{ marginTop: 16 }}>
        {todos.map((t) => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => handleToggle(t.id, t.completed)}
            />
            {t.text}
            <button
              onClick={() => handleDelete(t.id)}
              style={{ marginLeft: 8 }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
