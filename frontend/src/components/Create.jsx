import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('urgent');
  const [editTaskId, setEditTaskId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3001/tasks/${userId}`)
        .then(res => setTasks(res.data))
        .catch(err => {
          setError('Error fetching tasks.');
          console.log(err);
        });
    }
  }, [userId]);

  const handleAdd = () => {
    setError('');
    setSuccessMessage('');

    if (task.length > 100) {
      setError('Title should not exceed 100 characters.');
      return;
    }

    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount > 500) {
      setError('Description should not exceed 500 words.');
      return;
    }

    axios.post('http://localhost:3001/add', {
      task,
      description,
      priority,
      userId,
    })
      .then(result => {
        setSuccessMessage('Task added successfully!');
        setTasks([...tasks, result.data]);
        setTask('');
        setDescription('');
        setPriority('urgent');
      })
      .catch(err => {
        setError('Something went wrong!');
        console.log(err);
      });
  };

  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find(t => t._id === taskId);
    setTask(taskToEdit.task);
    setDescription(taskToEdit.description);
    setPriority(taskToEdit.priority);
    setEditTaskId(taskId);
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3001/task/${editTaskId}`, {
      task,
      description,
      priority
    })
      .then(result => {
        setSuccessMessage('Task updated successfully!');
        setTasks(tasks.map(t => t._id === editTaskId ? result.data : t));
        setTask('');
        setDescription('');
        setPriority('urgent');
        setEditTaskId(null);
      })
      .catch(err => {
        setError('Something went wrong!');
        console.log(err);
      });
  };

  const handleDelete = (taskId) => {
    axios.delete(`http://localhost:3001/task/${taskId}`)
      .then(() => {
        setSuccessMessage('Task deleted successfully!');
        setTasks(tasks.filter(t => t._id !== taskId));
      })
      .catch(err => {
        setError('Something went wrong!');
        console.log(err);
      });
  };

  // ✅ Logout handler
 const navigate = useNavigate(); // ✅ Step 2

   const handleLogout = () => {
     // Optional: localStorage.removeItem('token');
     navigate('/'); // ✅ Step 3
   };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">

      {/* 🔓 Logout Button */}
      <div className="w-full max-w-md flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">{editTaskId ? 'Edit Task' : 'Add Task'}</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}

        <input
          type="text"
          placeholder="Title (Max 100 characters)"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          maxLength={100}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <textarea
          placeholder="Description (Max 500 words)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          rows={5}
        />

        <div className="flex space-x-4 mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="priority"
              value="urgent"
              checked={priority === 'urgent'}
              onChange={(e) => setPriority(e.target.value)}
            />
            <span>Urgent</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="priority"
              value="non-urgent"
              checked={priority === 'non-urgent'}
              onChange={(e) => setPriority(e.target.value)}
            />
            <span>Non-Urgent</span>
          </label>
        </div>

        <button
          type="button"
          onClick={editTaskId ? handleUpdate : handleAdd}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {editTaskId ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      <div className="mt-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Your Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks available</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((taskItem) => (
              <li key={taskItem._id} className="bg-gray-200 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{taskItem.task}</h3>
                  <p>{taskItem.description}</p>
                  <span className="text-sm text-gray-500">Priority: {taskItem.priority}</span>
                </div>
                <div className="flex space-x-4">
                  <button onClick={() => handleEdit(taskItem._id)} className="text-blue-500">Edit</button>
                  <button onClick={() => handleDelete(taskItem._id)} className="text-red-500">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
