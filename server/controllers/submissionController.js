const path = require('path');
const fileUtils = require('../utils/fileUtils');
const submissionsFilePath = path.join(__dirname, '../models/submissions.json');

exports.submitCode = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user.id;

    if (!problemId || !code) {
      return res.status(400).json({ error: 'Problem ID and code are required' });
    }

    const submission = {
      id: Date.now().toString(),
      userId,
      problemId,
      code,
      language: language || 'javascript',
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    const submissions = await fileUtils.readJSON(submissionsFilePath);
    submissions.push(submission);
    await fileUtils.writeJSON(submissionsFilePath, submissions);

    res.status(201).json(submission);
  } catch (error) {
    console.error('Error submitting code:', error);
    res.status(500).json({ error: 'Failed to submit code' });
  }
};

exports.getSubmissionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const submissions = await fileUtils.readJSON(submissionsFilePath);
    const userSubmissions = submissions.filter(sub => sub.userId === userId);
    
    res.json(userSubmissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await fileUtils.readJSON(submissionsFilePath);
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching all submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};


// const path = require('path');
// const fileUtils = require('../utils/fileUtils');
// const { ROLES } = require('../config/constants');

// const submissionsFilePath = path.join(__dirname, '../models/submissions.json');
// const problemsFilePath = path.join(__dirname, '../models/problems.json');

// exports.submitCode = (req, res) => {
//   const { problemId, code, language, classId } = req.body;
//   const userId = req.user.id;
  
//   if (!problemId || !code) {
//     return res.status(400).json({ error: 'Problem ID and code are required.' });
//   }
  
//   // Simple simulation of code evaluation - in a real app you'd have a proper code runner
//   const randomResult = Math.random() > 0.3; // 70% pass rate
  
//   const submission = {
//     id: Date.now().toString(),
//     userId,
//     problemId,
//     code,
//     language: language || 'javascript',
//     classId: classId || null,
//     status: randomResult ? 'accepted' : 'rejected',
//     runtime: Math.floor(Math.random() * 500) + 'ms', // Simulated runtime
//     createdAt: new Date().toISOString()
//   };

//   fileUtils.readJSON(submissionsFilePath, (err, submissions) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error reading submissions data.' });
//     }
    
//     // Ensure submissions is an array
//     if (!Array.isArray(submissions)) {
//       submissions = [];
//     }
    
//     submissions.push(submission);
    
//     fileUtils.writeJSON(submissionsFilePath, submissions, err => {
//       if (err) {
//         return res.status(500).json({ error: 'Error saving submission data.' });
//       }
//       return res.status(201).json(submission);
//     });
//   });
// };

// exports.getSubmissionsByUser = (req, res) => {
//   const userId = req.params.userId || req.user.id;
  
//   // Teachers and admins can see any submissions, students can only see their own
//   if (req.user.role === ROLES.STUDENT && req.user.id !== userId) {
//     return res.status(403).json({ error: 'Access denied' });
//   }
  
//   fileUtils.readJSON(submissionsFilePath, (err, submissions) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error reading submissions data.' });
//     }
    
//     const userSubmissions = submissions.filter(sub => sub.userId == userId);
//     return res.status(200).json(userSubmissions);
//   });
// };

// exports.getSubmissionsByProblem = (req, res) => {
//   const problemId = req.params.problemId;
  
//   // Only teachers and admins can see all submissions for a problem
//   if (req.user.role !== ROLES.TEACHER && req.user.role !== ROLES.ADMIN) {
//     return res.status(403).json({ error: 'Access denied' });
//   }
  
//   fileUtils.readJSON(submissionsFilePath, (err, submissions) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error reading submissions data.' });
//     }
    
//     const problemSubmissions = submissions.filter(sub => sub.problemId == problemId);
//     return res.status(200).json(problemSubmissions);
//   });
// };

// exports.getSubmissionsByClass = (req, res) => {
//   const classId = req.params.classId;
  
//   // Only teachers who own the class and admins can see all submissions for a class
//   fileUtils.readJSON(path.join(__dirname, '../models/classes.json'), (err, classes) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error reading class data.' });
//     }
    
//     const classInfo = classes.find(c => c.id == classId);
//     if (!classInfo) {
//       return res.status(404).json({ error: 'Class not found.' });
//     }
    
//     if (req.user.role !== ROLES.ADMIN && classInfo.teacherId !== req.user.id) {
//       return res.status(403).json({ error: 'Access denied' });
//     }
    
//     fileUtils.readJSON(submissionsFilePath, (err, submissions) => {
//       if (err) {
//         return res.status(500).json({ error: 'Error reading submissions data.' });
//       }
      
//       const classSubmissions = submissions.filter(sub => sub.classId == classId);
//       return res.status(200).json(classSubmissions);
//     });
//   });
// };
