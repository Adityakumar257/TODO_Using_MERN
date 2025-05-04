// model/Todo.js
const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['urgent', 'non-urgent'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Todo', TodoSchema);
