require('dotenv').config();
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Import Routes
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const habitRoutes = require('./routes/habitRoutes');
const roleRoutes = require('./routes/roleRoutes');

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/roles', roleRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the ProdigyFlow API');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
