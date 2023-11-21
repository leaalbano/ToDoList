import React from 'react';
import ReactDOM from 'react-dom';
import TodoList from './components/ToDoList'; // Import your React component

ReactDOM.render(
  <React.StrictMode>
    <TodoList /> {/* Render your React component here */}
  </React.StrictMode>,
  document.getElementById('root') // This corresponds to the div in your index.html
);
