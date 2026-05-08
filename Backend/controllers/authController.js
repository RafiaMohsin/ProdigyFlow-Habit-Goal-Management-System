const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    // Check if user exists
    const user = await User.findByEmail(Email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Validate password
    let isMatch = await bcrypt.compare(Password, user.PasswordHash);
    
    // Fallback for existing plain-text passwords in the database
    if (!isMatch && Password === user.PasswordHash) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create JWT
    const payload = {
      user: {
        id: user.UserID,
        username: user.Username,
        roleId: user.RoleID
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret', // fallback for safety
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: payload.user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.register = async (req, res) => {
  const { Username, Email, Password, RoleID } = req.body;

  try {
    // Check if user already exists
    let user = await User.findByEmail(Email);
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Create the user
    const newUser = await User.create({
      Username,
      Email,
      PasswordHash: hashedPassword,
      RoleID: RoleID || 2 // Default to regular user
    });

    // Create JWT
    const payload = {
      user: {
        id: newUser.UserID,
        username: newUser.Username,
        roleId: newUser.RoleID
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: payload.user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
