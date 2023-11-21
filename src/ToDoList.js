import React, { useState } from 'react';
import './styles.css'; // Import your CSS file

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim() === '') {
      return;
    }
    setTasks([...tasks, newTask]);
    setNewTask('');
  };

  const markTaskComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = 'checked';
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <div className="header">
        <h2 style={{ margin: '5px' }}>Long To Do List</h2>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Title..."
        />
        <span onClick={addTask} className="addBtn">
          Add
        </span>
      </div>

      <ul id="myUL">
        {tasks.map((task, index) => (
          <li
            key={index}
            className={task === 'checked' ? 'checked' : ''}
            onClick={() => markTaskComplete(index)}
          >
            {task}
            <span
              className="close"
              onClick={() => deleteTask(index)}
            >
              &#215;
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
