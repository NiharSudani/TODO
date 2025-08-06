// Entry point for Express server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// Task routes
const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', tasksRouter);

app.get('/', (req, res) => {
  res.send('To-Do List API running');
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error('MongoDB connection error:', err));
