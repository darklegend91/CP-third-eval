// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const fs = require('fs').promises;
// const { authenticate, authorize } = require('../middleware/auth');

// const problemsPath = path.join(__dirname, '../models/problems.json');

// // Helper functions
// const readProblems = async () => {
//   try {
//     const data = await fs.readFile(problemsPath, 'utf8');
//     return JSON.parse(data || '[]');
//   } catch (error) {
//     if (error.code === 'ENOENT') return [];
//     throw error;
//   }
// };

// const writeProblems = async (data) => {
//   await fs.writeFile(problemsPath, JSON.stringify(data, null, 2));
// };

// // GET: Get problem by ID (Public)
// router.get('/:id', async (req, res) => {
//   try {
//     const problems = await readProblems();
//     const problem = problems.find(p => p.id === req.params.id);

//     if (!problem) {
//       return res.status(404).json({ error: 'Problem not found' });
//     }

//     res.json(problem);
//   } catch (error) {
//     console.error('Error fetching problem:', error);
//     res.status(500).json({ error: 'Failed to fetch problem' });
//   }
// });

// // POST: Create new problem (Teacher/Admin only)
// router.post(
//   '/',
//   authenticate,
//   authorize(['teacher', 'admin']),
//   async (req, res) => {
//     try {
//       const { title, description, difficulty, constraints, testCases, solutionTemplate } = req.body;
      
//       // Validation
//       if (!title?.trim() || !description?.trim()) {
//         return res.status(400).json({ error: 'Title and description are required' });
//       }

//       // Create new problem
//       const newProblem = {
//         id: Date.now().toString(),
//         title: title.trim(),
//         description: description.trim(),
//         difficulty: difficulty || 'medium',
//         constraints: constraints || [],
//         testCases: testCases || [],
//         solutionTemplate: solutionTemplate || '',
//         createdBy: req.user.id,
//         createdAt: new Date().toISOString()
//       };

//       // Save to file
//       const problems = await readProblems();
//       problems.push(newProblem);
//       await writeProblems(problems);

//       res.status(201).json(newProblem);
//     } catch (error) {
//       console.error('Error creating problem:', error);
//       res.status(500).json({ error: 'Failed to create problem' });
//     }
//   }
// );

// module.exports = router;

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

const problemsPath = path.join(__dirname, '../models/problems.json');

router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(problemsPath, 'utf8');
    const problems = JSON.parse(data || '[]');
    res.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: 'Failed to load problems' });
  }
});

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const fs = require('fs').promises;
// const { authenticate, authorize } = require('../middleware/auth');

// const problemsPath = path.join(__dirname, '../models/problems.json');
// const readProblems = async () => {
//   try {
//     const data = await fs.readFile(problemsPath, 'utf8');
//     return JSON.parse(data || '[]');
//   } catch (error) {
//     if (error.code === 'ENOENT') return [];
//     throw error;
//   }
// };
// const writeProblems = async (data) => {
//   await fs.writeFile(problemsPath, JSON.stringify(data, null, 2));
// };

// router.post(
//   '/',
//   authenticate,
//   authorize(['teacher', 'admin']),
//   async (req, res) => {
//     try {
//       const { title, description, difficulty, constraints, testCases, solutionTemplate } = req.body;
//       if (!title || !description) {
//         return res.status(400).json({ error: 'Title and description are required.' });
//       }
//       const newProblem = {
//         id: Date.now().toString(),
//         title: title.trim(),
//         description: description.trim(),
//         difficulty: difficulty || 'medium',
//         constraints: constraints || [],
//         testCases: testCases || [],
//         solutionTemplate: solutionTemplate || '',
//         createdBy: req.user.id,
//         createdAt: new Date().toISOString()
//       };
//       const problems = await readProblems();
//       problems.push(newProblem);
//       await writeProblems(problems);
//       res.status(201).json(newProblem);
//     } catch (error) {
//       console.error('Error creating problem:', error);
//       res.status(500).json({ error: 'Failed to create problem' });
//     }
//   }
// );

// module.exports = router;
