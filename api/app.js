const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();

// Middleware
app.use(express.json());

// app.use(cors({
//   origin: 'http://localhost:4200', // Your Angular app URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

app.use(cors());

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/goal', require('./routes/goalRoutes'));
app.use('/task', require('./routes/taskRoutes'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});