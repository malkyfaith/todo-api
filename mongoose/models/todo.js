const {mongoose} = require('../db/mongoose');

const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number, // unix timestamp
    default: null
  }
});

module.exports = {
  Todo
};
