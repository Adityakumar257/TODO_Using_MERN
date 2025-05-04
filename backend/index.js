require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./model/User");
const TodoModel = require('./model/Todo');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((error) => {
    console.error('Connection error', error);
  });

const JWT_SECRET = process.env.JWT_SECRET;

// User Registration
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// User Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add Task
app.post('/add', (req, res) => {
  const { task, description, priority } = req.body;

  TodoModel.create({ task, description, priority })
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Get All Tasks
app.get('/tasks', (req, res) => {
  TodoModel.find()
    .then(tasks => res.json(tasks))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Get Task by ID
app.get('/task/:id', (req, res) => {
  const { id } = req.params;
  TodoModel.findById(id)
    .then(task => {
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// Update Task
app.put('/task/:id', (req, res) => {
  const { id } = req.params;
  const { task, description, priority } = req.body;

  TodoModel.findByIdAndUpdate(id, { task, description, priority }, { new: true })
    .then(updatedTask => {
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(updatedTask);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// Delete Task
app.delete('/task/:id', (req, res) => {
  const { id } = req.params;
  TodoModel.findByIdAndDelete(id)
    .then(deletedTask => {
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
