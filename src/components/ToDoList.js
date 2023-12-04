import React, { useState, useEffect } from 'react';
import PomodoroTimer from './Timer';
import './styles.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');


  const fetchTasks = () => {
    fetch('http://localhost:8081/getTasks') 
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTasks(data);
      })
      .catch(error => console.error('Error:', error));
  };

 //Render List when first load
  useEffect(() => {
    fetchTasks();
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

    fetch('http://localhost:8081/createTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
      .then(response => response.json())
      .then(() => {
        setNewTask('');
        fetchTasks(); // Fetch tasks after adding a new task
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  
  const toggleTaskStatus = (id, title, currentStatus) => {
    const updatedStatus = currentStatus === 'complete' ? 'uncomplete' : 'complete';

    const updatedTask = {
      id: id,
      title: title,
      status: updatedStatus
    };
    
    fetch('http://localhost:8081/updateTask', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask)
    })
    .then(response => response.json())
    .then(() => {
      fetchTasks();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
  
  

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    fetch(`http://localhost:8081/deleteTask?id=${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete task with id ${id}`);
        }
        fetchTasks(); // Fetch tasks after deleting a task
      })
      .catch((error) => {
        console.error('Error:', error);
        // If the deletion fails, revert the state to its previous state
        setTasks(tasks);
      });
  };

  return (
    <div className="todo-wrapper">
    <div>
      <PomodoroTimer />
      <div className="header">
        <h2 style={{ margin: '5px' }}>To Do List</h2>
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
            onClick={() => toggleTaskStatus(task.id, task.title, task.status)}
          >
            {task.title}
            <div className="task-date">Date Added: {new Date(task.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
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
    </div>
  );
};

export default TodoList;
