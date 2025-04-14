const path = require('path');
const fileUtils = require('../utils/fileUtils');

const problemsFilePath = path.join(__dirname, '../models/problems.json');

exports.getProblems = (req, res) => {
  fileUtils.readJSON(problemsFilePath, (err, problems) => {
    if (err) {
      console.error('Error reading problems data:', err);
      return res.status(500).json({ error: 'Error reading problems data.' });
    }
    return res.status(200).json(problems);
  });
};

exports.getProblemById = (req, res) => {
  const problemId = req.params.id;
  fileUtils.readJSON(problemsFilePath, (err, problems) => {
    if (err) {
      console.error('Error reading problems data:', err);
      return res.status(500).json({ error: 'Error reading problems data.' });
    }
    const problem = problems.find(p => p.id == problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }
    return res.status(200).json(problem);
  });
};

exports.createProblem = (req, res) => {
  const { title, description, difficulty, constraints, examples } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }
  
  const newProblem = {
    id: Date.now().toString(),
    title,
    description,
    difficulty: difficulty || 'medium',
    constraints: constraints || [],
    examples: examples || [],
    createdBy: req.user.id,
    createdAt: new Date().toISOString()
  };
  
  fileUtils.readJSON(problemsFilePath, (err, problems) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading problems data.' });
    }
    
    problems.push(newProblem);
    
    fileUtils.writeJSON(problemsFilePath, problems, err => {
      if (err) {
        return res.status(500).json({ error: 'Error saving problem data.' });
      }
      return res.status(201).json(newProblem);
    });
  });
};

exports.updateProblem = (req, res) => {
  const problemId = req.params.id;
  const updates = req.body;
  
  fileUtils.readJSON(problemsFilePath, (err, problems) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading problems data.' });
    }
    
    const index = problems.findIndex(p => p.id == problemId);
    if (index === -1) {
      return res.status(404).json({ error: 'Problem not found.' });
    }
    
    // Check if user has permission (teacher can only edit their own problems)
    if (req.user.role !== 'admin' && problems[index].createdBy !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit problems you created.' });
    }
    
    // Update problem fields
    problems[index] = { 
      ...problems[index], 
      ...updates,
      id: problemId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    fileUtils.writeJSON(problemsFilePath, problems, err => {
      if (err) {
        return res.status(500).json({ error: 'Error saving problem data.' });
      }
      return res.status(200).json(problems[index]);
    });
  });
};

exports.deleteProblem = (req, res) => {
  const problemId = req.params.id;
  
  fileUtils.readJSON(problemsFilePath, (err, problems) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading problems data.' });
    }
    
    const index = problems.findIndex(p => p.id == problemId);
    if (index === -1) {
      return res.status(404).json({ error: 'Problem not found.' });
    }
    
    // Check if user has permission
    if (req.user.role !== 'admin' && problems[index].createdBy !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete problems you created.' });
    }
    
    // Remove the problem
    problems.splice(index, 1);
    
    fileUtils.writeJSON(problemsFilePath, problems, err => {
      if (err) {
        return res.status(500).json({ error: 'Error saving problem data.' });
      }
      return res.status(200).json({ message: 'Problem deleted successfully.' });
    });
  });
};
