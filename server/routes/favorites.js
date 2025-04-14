const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const path = require('path');
const fileUtils = require('../utils/fileUtils');

const usersFilePath = path.join(__dirname, '../models/users.json');

// Get user favorites
router.get('/', authenticate, (req, res) => {
  const userId = req.user.id;
  
  fileUtils.readJSON(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading user data' });
    }
    
    const user = users.find(u => u.id == userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user.favorites || []);
  });
});

// Add problem to favorites
router.post('/:problemId', authenticate, (req, res) => {
  const userId = req.user.id;
  const problemId = req.params.problemId;
  
  fileUtils.readJSON(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading user data' });
    }
    
    const userIndex = users.findIndex(u => u.id == userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Initialize favorites if it doesn't exist
    if (!users[userIndex].favorites) {
      users[userIndex].favorites = [];
    }
    
    // Add to favorites if not already there
    if (!users[userIndex].favorites.includes(problemId)) {
      users[userIndex].favorites.push(problemId);
    }
    
    fileUtils.writeJSON(usersFilePath, users, err => {
      if (err) {
        return res.status(500).json({ error: 'Error saving user data' });
      }
      
      res.json(users[userIndex].favorites);
    });
  });
});

// Remove problem from favorites
router.delete('/:problemId', authenticate, (req, res) => {
  const userId = req.user.id;
  const problemId = req.params.problemId;
  
  fileUtils.readJSON(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading user data' });
    }
    
    const userIndex = users.findIndex(u => u.id == userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove from favorites
    if (users[userIndex].favorites) {
      users[userIndex].favorites = users[userIndex].favorites.filter(id => id != problemId);
    }
    
    fileUtils.writeJSON(usersFilePath, users, err => {
      if (err) {
        return res.status(500).json({ error: 'Error saving user data' });
      }
      
      res.json(users[userIndex].favorites);
    });
  });
});

module.exports = router;
