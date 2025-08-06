const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const task = new Task({ title, description, date });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Mark task as done
router.patch('/:id/done', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { done: true },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit a task
router.put('/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
