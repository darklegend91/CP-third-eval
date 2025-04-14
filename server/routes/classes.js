const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const { authenticate, authorize } = require('../middleware/auth');

const classesPath = path.join(__dirname, '../models/classes.json');

// Helper functions
const readJSON = async () => {
  try {
    const data = await fs.readFile(classesPath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

const writeJSON = async (data) => {
  await fs.writeFile(classesPath, JSON.stringify(data, null, 2));
};

// POST /api/classes - Create class
router.post('/', 
  authenticate,
  authorize(['teacher', 'admin']),
  async (req, res) => {
    try {
      // Validate request body
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: 'Invalid request format' });
      }

      const { name, description } = req.body;

      // Validate required fields
      if (!name?.trim() || !description?.trim()) {
        return res.status(400).json({ 
          error: 'Class name and description are required' 
        });
      }

      // Create class object
      const newClass = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        teacherId: req.user.id,
        students: [],
        problems: [],
        inviteCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
        createdAt: new Date().toISOString()
      };

      // Save to JSON
      const classes = await readJSON();
      classes.push(newClass);
      await writeJSON(classes);

      res.status(201).json(newClass);

    } catch (error) {
      console.error('Class creation error:', error);
      res.status(500).json({ error: 'Failed to create class' });
    }
  }
);

// GET /api/classes/teacher/:teacherId
router.get('/teacher/:teacherId',
  authenticate,
  authorize(['teacher', 'admin']),
  async (req, res) => {
    try {
      const classes = await readJSON();
      const teacherClasses = classes.filter(c => c.teacherId === req.params.teacherId);
      res.json(teacherClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ error: 'Failed to fetch classes' });
    }
  }
);

// GET /api/classes/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const classes = await readJSON();
    const classData = classes.find(c => c.id === req.params.id);

    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Authorization check
    if (req.user.role === 'teacher' && classData.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(classData);
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ error: 'Failed to fetch class details' });
  }
});

module.exports = router;
