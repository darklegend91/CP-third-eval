const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const { authenticate } = require('../middleware/auth');

const submissionsPath = path.join(__dirname, '../models/submissions.json');

const readSubmissions = async () => {
  try {
    const data = await fs.readFile(submissionsPath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

// Get submissions for a user
router.get('/user/:userId', authenticate, async (req, res) => {
  const submissions = await readSubmissions();
  res.json(submissions.filter(s => s.userId === req.params.userId));
});

module.exports = router;
