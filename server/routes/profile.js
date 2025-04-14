const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const { authenticate, authorize } = require('../middleware/auth');

// File paths
const usersPath = path.join(__dirname, '../models/users.json');
const problemsPath = path.join(__dirname, '../models/problems.json');
const submissionsPath = path.join(__dirname, '../models/submissions.json');
const classesPath = path.join(__dirname, '../models/classes.json');
const playlistsPath = path.join(__dirname, '../models/playlists.json');

// Helper functions
const readJSON = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    console.error(`Error reading ${filePath}:`, error);
    throw error;
  }
};

// Get user profile with role validation
router.get('/', 
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const users = await readJSON(usersPath);
      const user = users.find(u => u.id === userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Remove sensitive information
      const { password, ...safeUser } = user;
      const profileData = { user: safeUser };

      // Switch based on user role
      switch(user.role) {
        case 'student':
          await handleStudentProfile(profileData, userId);
          break;
        case 'teacher':
          await handleTeacherProfile(profileData, userId);
          break;
        case 'admin':
          await handleAdminProfile(profileData);
          break;
        default:
          return res.status(403).json({ error: 'Unauthorized role' });
      }

      res.json(profileData);
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch profile data' });
    }
  }
);

// Student-specific data
async function handleStudentProfile(profileData, userId) {
  const [playlists, submissions, allProblems] = await Promise.all([
    readJSON(playlistsPath),
    readJSON(submissionsPath),
    readJSON(problemsPath)
  ]);

  profileData.playlists = playlists.filter(p => p.userId === userId);
  profileData.submissions = submissions.filter(s => s.userId === userId);
  profileData.favorites = allProblems.filter(p => 
    profileData.user.favorites?.includes(p.id)
  );
}

// Teacher-specific data
async function handleTeacherProfile(profileData, userId) {
  const [classes, problems, submissions] = await Promise.all([
    readJSON(classesPath),
    readJSON(problemsPath),
    readJSON(submissionsPath)
  ]);

  profileData.classes = classes.filter(c => c.teacherId === userId);
  profileData.problems = problems.filter(p => p.createdBy === userId);
  
  const classIDs = profileData.classes.map(c => c.id);
  profileData.classSubmissions = submissions.filter(s => 
    s.classId && classIDs.includes(s.classId)
  );
}

// Admin-specific data
async function handleAdminProfile(profileData) {
  const [users, problems, submissions, classes] = await Promise.all([
    readJSON(usersPath),
    readJSON(problemsPath),
    readJSON(submissionsPath),
    readJSON(classesPath)
  ]);

  profileData.users = users.map(({ password, ...u }) => u);
  profileData.stats = {
    totalUsers: users.length,
    totalProblems: problems.length,
    totalSubmissions: submissions.length,
    totalClasses: classes.length
  };
}

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const fs = require('fs').promises;
// const { authenticate } = require('../middleware/auth');

// // File paths
// const usersPath = path.join(__dirname, '../models/users.json');
// const problemsPath = path.join(__dirname, '../models/problems.json');
// const submissionsPath = path.join(__dirname, '../models/submissions.json');
// const classesPath = path.join(__dirname, '../models/classes.json');
// const playlistsPath = path.join(__dirname, '../models/playlists.json');

// // Helper functions
// const readJSON = async (filePath) => {
//   try {
//     const data = await fs.readFile(filePath, 'utf8');
//     return JSON.parse(data || '[]');
//   } catch (error) {
//     if (error.code === 'ENOENT') return [];
//     throw error;
//   }
// };

// // Get user profile with role-specific data
// router.get('/', authenticate, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const users = await readJSON(usersPath);
//     const user = users.find(u => u.id === userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Remove sensitive information
//     const { password, ...safeUser } = user;
    
//     // Prepare response object
//     const profileData = { user: safeUser };

//     // Role-specific data
//     if (user.role === 'student') {
//       // Get student's playlists
//       const playlists = await readJSON(playlistsPath);
//       profileData.playlists = playlists.filter(p => p.userId === userId);
      
//       // Get student's submissions
//       const submissions = await readJSON(submissionsPath);
//       profileData.submissions = submissions.filter(s => s.userId === userId);
      
//       // Get favorite problems
//       const problems = await readJSON(problemsPath);
//       profileData.favorites = problems.filter(p => 
//         user.favorites && user.favorites.includes(p.id)
//       );
//     }
    
//     else if (user.role === 'teacher') {
//       // Get teacher's classes
//       const classes = await readJSON(classesPath);
//       profileData.classes = classes.filter(c => c.teacherId === userId);
      
//       // Get problems created by teacher
//       const problems = await readJSON(problemsPath);
//       profileData.problems = problems.filter(p => p.createdBy === userId);
      
//       // Get all submissions for teacher's classes
//       const submissions = await readJSON(submissionsPath);
//       const teacherClasses = profileData.classes.map(c => c.id);
//       profileData.classSubmissions = submissions.filter(s => 
//         s.classId && teacherClasses.includes(s.classId)
//       );
//     }
    
//     else if (user.role === 'admin') {
//       // Get all users (without passwords)
//       const allUsers = await readJSON(usersPath);
//       profileData.users = allUsers.map(({ password, ...u }) => u);
      
//       // Get basic statistics
//       const problems = await readJSON(problemsPath);
//       const submissions = await readJSON(submissionsPath);
//       const classes = await readJSON(classesPath);
      
//       profileData.stats = {
//         totalUsers: allUsers.length,
//         totalProblems: problems.length,
//         totalSubmissions: submissions.length,
//         totalClasses: classes.length
//       };
//     }

//     res.json(profileData);
//   } catch (error) {
//     console.error('Profile error:', error);
//     res.status(500).json({ error: 'Failed to fetch profile data' });
//   }
// });

// module.exports = router;
