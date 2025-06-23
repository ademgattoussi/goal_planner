const db = require('../config/db');

// Create a new task
const createTask = async (req, res) => {
  const {
    taskName,
    description,
    frequency,
    dueDate,
    isCompleted,
    userId,
  } = req.body;

  if (!taskName || !userId) {
    return res
      .status(400)
      .json({ error: 'taskName and userId are required' });
  }

  const sql = `
    INSERT INTO tasks (taskName, description, frequency, dueDate, isCompleted, userId)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.execute(sql, [
      taskName,
      description,
      frequency,
      dueDate,
      isCompleted,
      userId,
    ]);

    res.status(201).json({
      message: 'Task created successfully',
      taskId: result.insertId,
    });
  } catch (err) {
    console.error('Error creating task:', err);

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res
        .status(400)
        .json({ error: 'Invalid userId, user does not exist' });
    }

    if (err.code === 'ER_BAD_NULL_ERROR') {
      return res
        .status(400)
        .json({ error: 'Missing required fields' });
    }

    res
      .status(500)
      .json({ error: 'Failed to create task due to a database error' });
  }
};

// Get all tasks for a user
const getTasksByUserId = async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const [tasks] = await db.execute(
      `SELECT * FROM tasks WHERE userId = ? ORDER BY createdDate DESC`,
      [userId]
    );
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get tasks by frequency for a user
const getTasksByFrequency = async (req, res) => {
  const { userId, frequency } = req.query;

  if (!userId || !frequency) {
    return res
      .status(400)
      .json({ error: 'userId and frequency are required' });
  }

  try {
    const [tasks] = await db.execute(
      `SELECT * FROM tasks WHERE userId = ? AND frequency = ? ORDER BY createdDate DESC`,
      [userId, frequency]
    );
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks by frequency:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update task status (complete/incomplete)
const updateTaskStatus = async (req, res) => {
  const taskId = req.params.taskId;
  const { isCompleted } = req.body;

  if (isCompleted === undefined) {
    return res
      .status(400)
      .json({ error: 'isCompleted status is required' });
  }

  try {
    const [result] = await db.execute(
      `UPDATE tasks SET isCompleted = ? WHERE taskId = ?`,
      [isCompleted, taskId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task status updated successfully' });
  } catch (err) {
    console.error('Error updating task status:', err);
    res.status(500).json({ error: 'Failed to update task status' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const [result] = await db.execute(
      `DELETE FROM tasks WHERE taskId = ?`,
      [taskId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = {
  createTask,
  getTasksByUserId,
  getTasksByFrequency,
  updateTaskStatus,
  deleteTask,
};
