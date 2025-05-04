import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');

  // Dummy user (replace with actual context if needed)
  const user = { role: 'admin' };

  // Logout Handler
  const navigate = useNavigate(); // ✅ Step 2

  const handleLogout = () => {
    // Optional: localStorage.removeItem('token');
    navigate('/'); // ✅ Step 3
  };


  // Fetch all tasks
  useEffect(() => {
    axios.get('http://localhost:3001/tasks')
      .then(res => setTasks(res.data))
      .catch(err => {
        setError('Error fetching tasks.');
        console.log(err);
      });
  }, []);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Delete task
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

  // Edit task setup
  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find(t => t._id === taskId);
    if (taskToEdit) {
      setEditTaskId(taskId);
      setTask(taskToEdit.task);
      setDescription(taskToEdit.description);
      setPriority(taskToEdit.priority);
    }
  };

  // Update task
  const handleUpdate = () => {
    if (!task || !description || !priority) {
      setError('Please fill in all fields.');
      return;
    }

    axios.put(`http://localhost:3001/task/${editTaskId}`, {
      task,
      description,
      priority
    })
      .then(res => {
        setSuccessMessage('Task updated successfully!');
        setTasks(tasks.map(t => (t._id === editTaskId ? res.data : t)));
        setEditTaskId(null);
        setTask('');
        setDescription('');
        setPriority('');
      })
      .catch(err => {
        setError('Error updating task.');
        console.log(err);
      });
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome to Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Messages */}
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}

      {/* Edit Task Form */}
      {editTaskId && (
        <div className="flex justify-center mb-8">
          <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">Edit Task</h2>

            <input
              type="text"
              placeholder="Title"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />

            <div className="flex space-x-4 mb-4">
              <label>
                <input
                  type="radio"
                  name="priority"
                  value="urgent"
                  checked={priority === 'urgent'}
                  onChange={(e) => setPriority(e.target.value)}
                /> Urgent
              </label>
              <label>
                <input
                  type="radio"
                  name="priority"
                  value="non-urgent"
                  checked={priority === 'non-urgent'}
                  onChange={(e) => setPriority(e.target.value)}
                /> Non-Urgent
              </label>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Update Task
              </button>
              <button
                onClick={() => setEditTaskId(null)}
                className="bg-gray-300 text-black py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks available</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((taskItem) => (
              <li key={taskItem._id} className="flex justify-between items-start bg-gray-200 p-4 rounded-lg">
                <div>
                  <h3 className="font-semibold">{taskItem.task}</h3>
                  <p className="text-sm mb-1">{taskItem.description}</p>
                  <span className="text-xs text-gray-600">Priority: {taskItem.priority}</span>
                </div>
                {user.role === 'admin' && (
                  <div className="flex flex-col space-y-2">
                    <button onClick={() => handleEdit(taskItem._id)} className="text-blue-500 cursor-pointer">Edit</button>
                    <button onClick={() => handleDelete(taskItem._id)} className="text-red-500 cursor-pointer">Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
