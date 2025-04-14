const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const { authenticate, authorize } = require('../middleware/auth');

const usersPath = path.join(__dirname, '../models/users.json');

router.put('/users/:userId/role', 
  authenticate, 
  authorize(['admin']), 
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      
      if (!role || !['student', 'teacher', 'admin'].includes(role)) {
        return res.status(400).json({ 
          error: 'Valid role required (student, teacher, or admin)' 
        });
      }
      
      const users = await fs.readFile(usersPath, 'utf8').then(JSON.parse);
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      users[userIndex].role = role;
      await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
      
      res.json({ message: 'Role updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update role' });
    }
  }
);

module.exports = router;
