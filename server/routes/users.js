const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const { authenticate } = require('../middleware/auth');

// Path to your users data
const usersPath = path.join(__dirname, '../models/users.json');
const readUsers = async () => {
  try {
    const data = await fs.readFile(usersPath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};
const writeUsers = async (data) => {
  await fs.writeFile(usersPath, JSON.stringify(data, null, 2));
};

// PATCH /api/users/:userId/favorites/:problemId
router.patch('/:userId/favorites/:problemId', authenticate, async (req, res) => {
  const { userId, problemId } = req.params;
  try {
    const users = await readUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Initialize favorites if necessary
    if (!Array.isArray(user.favorites)) user.favorites = [];

    // Toggle favorite
    const idx = user.favorites.indexOf(problemId);
    if (idx === -1) {
      user.favorites.push(problemId);
    } else {
      user.favorites.splice(idx, 1);
    }
    await writeUsers(users);
    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Failed to update favorites:', error);
    res.status(500).json({ error: 'Failed to update favorites' });
  }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { authenticate, authorize } = require('../middleware/auth');
// const fileUtils = require('../utils/fileUtils');
// const path = require('path');

// const usersPath = path.join(__dirname, '../models/users.json');

// router.get('/', 
//   authenticate,
//   authorize(['admin']),
//   async (req, res) => {
//     try {
//       const users = await fileUtils.readJSON(usersPath);
//       res.json(users.map(({ password, ...user }) => user));
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch users' });
//     }
//   }
// );

// module.exports = router;
