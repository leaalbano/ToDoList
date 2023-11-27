import React, { useState, useEffect } from 'react';
import PomodoroTimer from './Timer';
import './styles.css'; // Import your CSS file

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetch('http://localhost:8081/getTasks') // replace with your server's URL
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTasks(data);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const addTask = () => {
    if (newTask.trim() === '') {
      return;
    }
  
    const task = {
      title: newTask,
      status: 'uncomplete',
      createdAt: new Date().toISOString()
    };
  
    fetch('http://localhost:8081/createTask', { // replace with your server's URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
      .then(response => response.json())
      .then(data => {
        setTasks(oldTasks => [...oldTasks, data]);
        setNewTask('');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const markTaskComplete = (id) => {
    const updatedTasks = tasks.map(task => task.id === id ? {...task, status: 'complete'} : task);
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <PomodoroTimer />
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
        {tasks.map((task) => (
          <li
            key={task.id}
            className={task.status === 'complete' ? 'checked' : ''}
            onClick={() => markTaskComplete(task.id)}
          >
            {task.title}
            <span
              className="close"
              onClick={() => deleteTask(task.id)}
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
