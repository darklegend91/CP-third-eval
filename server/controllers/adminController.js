const path = require('path');
const fileUtils = require('../utils/fileUtils');
const { ROLES } = require('../config/constants');

const usersFilePath = path.join(__dirname, '../models/users.json');

exports.getAllUsers = (req, res) => {
  fileUtils.readJSON(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading user data.' });
    }
    
    // Remove passwords from response
    const safeUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    return res.status(200).json(safeUsers);
  });
};

exports.getUserById = (req, res) => {
  const userId = req.params.id;
  
  fileUtils.readJSON(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading user data.' });
    }
    
    const user = users.find(u => u.id == userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    return res.status(200).json(userWithoutPassword);
  });
};

exports.updateUserRole = (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  
  if (!role || ![ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN].includes(role)) {
    return res.status(400).json({ 
      error: 'Valid role is required.',
      validRoles: [ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN]
    });
  }
  
  fileUtils.readJSON(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading user data.' });
    }
    
    const index = users.findIndex(u => u.id == userId);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    // Update user role
    users[index].role = role;
    users[index].updatedAt = new Date().toISOString();
    
    fileUtils.writeJSON(usersFilePath, users, err => {
      if (err) {
        return res.status(500).json({ error: 'Error saving user data.' });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = users[index];
      
      return res.status(200).json(userWithoutPassword);
    });
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  
  // Prevent admins from deleting themselves
  if (userId === req.user.id) {
    return res.status(400).json({ error: 'You cannot delete your own account.' });
  }
  
  fileUtils.readJSON(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading user data.' });
    }
    
    const index = users.findIndex(u => u.id == userId);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    // Remove the user
    users.splice(index, 1);
    
    fileUtils.writeJSON(usersFilePath, users, err => {
      if (err) {
        return res.status(500).json({ error: 'Error saving user data.' });
      }
      return res.status(200).json({ message: 'User deleted successfully.' });
    });
  });
};
