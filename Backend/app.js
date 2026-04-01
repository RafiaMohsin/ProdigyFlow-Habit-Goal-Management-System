const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load variables at the very start
const { connectDB } = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/performance', require('./routes/performanceRoutes'));
app.use('/achievements', require('./routes/achievementRoutes'));
app.use('/notifications', require('./routes/notificationRoutes'));
app.use('/reminders', require('./routes/reminderRoutes'));
app.use('/user-achievements', require('./routes/userAchievementRoutes'));


// Use the port from .env, or default to 5000 if not found
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});