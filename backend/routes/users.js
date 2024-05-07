// This file contains all API endpoints for interacting with the "users" collection in the MongoDB database
const express = require('express');
const router = express.Router();
// import bcrypt for comparing password to hashed password
const bcrypt = require('bcrypt');
// import JWT (JSON Web Token) to create a web token to the user after a successful login - allows user to make API calls
const jwt = require('jsonwebtoken');

// import users data model schema
const { users } = require('../models/models');

const org = process.env.ORG_ID;

// API endpoint to handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database based on the provided username and organization ID
    const user = await users.findOne({ username: username, org: org });
    if (!user) {
      // If the user is not found, return an error message
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If the passwords do not match, return an error message
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Create a payload containing the user's name and role
    const payload = {
      name: user.name,
      role: user.role
    };

    // Generate a JSON Web Token (JWT) signed with a secret key and set an expiration of 30 days
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    // Send the token back to the client in the response body
    res.json({ token });
  } catch (err) {
    // If an error occurs during the process, return a server error
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

