// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  scanTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./dynamo";
// Import your SCSS file here. Make sure your build system supports SCSS.
import './App.scss'; // Assuming you save the SCSS as App.scss in the src folder

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    // Fetch todos when the component mounts
    scanTodos().then(setTodos);
  }, []);

  // Handler for adding a new todo
  const handleAdd = async () => {
    if (!text.trim()) return; // Prevent adding empty todos
    const newItem = {
      id: Date.now().toString(), // Unique ID for the new todo
      text,
      completed: false, // New todos are not completed by default
    };
    await createTodo(newItem); // Save the new todo to DynamoDB
    setTodos((prev) => [...prev, newItem]); // Update local state
    setText(""); // Clear the input field
  };

  // Handler for toggling a todo's completion status
  const handleToggle = async (id, currentCompletedStatus) => {
    // Update the todo's 'completed' status in DynamoDB
    await updateTodo(id, { completed: !currentCompletedStatus });
    // Update the local state to reflect the change immediately
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !currentCompletedStatus } : todo
      )
    );
  };

  // Handler for deleting a todo
  const handleDelete = async (id) => {
    await deleteTodo(id); // Delete the todo from DynamoDB
    // Remove the todo from local state
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className="app-container"> {/* Main container for the app */}
      <h1>Todo App</h1>

      <div className="input-section"> {/* Section for input and add button */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New todo"
        />
        <button onClick={handleAdd}>Add Todo</button>
      </div>

      <div className="list-section"> {/* Section for displaying the todo list */}
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id, todo.completed)}
              />
              {/* Apply 'completed' class based on todo status */}
              <span className={todo.completed ? "completed" : ""}>
                {todo.text}
              </span>
              <button
                onClick={() => handleDelete(todo.id)}
                className="delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
