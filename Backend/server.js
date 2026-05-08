require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Added for frontend connectivity
const app = express();

const { connectDB } = require('./config/db');

// 1. Import Routes 
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const habitRoutes = require('./routes/habitRoutes');
const roleRoutes = require('./routes/roleRoutes');
const authRoutes = require('./routes/authRoutes');

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

const authMiddleware = require('./middleware/authMiddleware');

// 3. Mount Routes 

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);
app.use('/api/habits', authMiddleware, habitRoutes);
app.use('/api/roles', authMiddleware, roleRoutes);

// Habit Tracking Layer
app.use('/api/logs', authMiddleware, habitLogRoutes); 
app.use('/api/streaks', authMiddleware, streakRoutes);
app.use('/api/notes', authMiddleware, habitNoteRoutes);

// Goal Management Layer
app.use('/api/goals', authMiddleware, goalRoutes);
app.use('/api/goal-habits', authMiddleware, goalHabitRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the ProdigyFlow API - Systems Active');
});

// 4. Global Error Handling (Optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});


//analytics layer
app.use('/api/performance', authMiddleware, require('./routes/performanceRoutes'));

//remainder and notification layer
app.use('/api/notifications', authMiddleware, require('./routes/notificationRoutes'));
app.use('/api/reminders', authMiddleware, require('./routes/reminderRoutes'));

//achievement layer
app.use('/api/achievements', authMiddleware, require('./routes/achievementRoutes'));
app.use('/api/user-achievements', authMiddleware, require('./routes/userAchievementRoutes'));


// Start Server
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`ProdigyFlow Server running on port ${PORT}`);
  console.log(`Check API status at http://localhost:${PORT}/`);
});
