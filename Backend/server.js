require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Added for frontend connectivity
const app = express();

// 1. Import Routes 
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const habitRoutes = require('./routes/habitRoutes');
const roleRoutes = require('./routes/roleRoutes');

// --- Habit Tracking Layer ---
const habitLogRoutes = require('./routes/habitLogRoutes');
const streakRoutes = require('./routes/streakRoutes');
const habitNoteRoutes = require('./routes/habitNoteRoutes');

// --- Goal Management Layer ---
const goalRoutes = require('./routes/goalRoutes');
const goalHabitRoutes = require('./routes/goalHabitRoutes');

// 2. Standard Middleware
app.use(cors()); // Enable CORS
app.use(express.json());

// 3. Mount Routes 

// System & Habit Management
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/roles', roleRoutes);

// Habit Tracking Layer
app.use('/api/logs', habitLogRoutes); 
app.use('/api/streaks', streakRoutes);
app.use('/api/notes', habitNoteRoutes);

// Goal Management Layer
app.use('/api/goals', goalRoutes);
app.use('/api/goal-habits', goalHabitRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the ProdigyFlow API - Systems Active');
});

// 4. Global Error Handling (Optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

// Start Server
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`🚀 ProdigyFlow Server running on port ${PORT}`);
  console.log(`Check API status at http://localhost:${PORT}/`);
});
