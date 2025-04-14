const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';
const classRoutes = require('./routes/classes');
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
const playlistRoutes = require('./routes/playlists');
app.use('/api/playlists', playlistRoutes);
const submissionRoutes = require('./routes/submissions');
app.use('/api/submissions', submissionRoutes);
app.use('/api/classes', classRoutes);
const problemsRouter = require('./routes/problems');
app.use('/api/problems', problemsRouter);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);




// Configure middleware
app.use(cors());
app.use(bodyParser.json());

// File paths
const usersPath = path.join(__dirname, 'models', 'users.json');
const problemsPath = path.join(__dirname, 'models', 'problems.json');
const submissionsPath = path.join(__dirname, 'models', 'submissions.json');
const classesPath = path.join(__dirname, 'models', 'classes.json');
const playlistsPath = path.join(__dirname, 'models', 'playlists.json');

// Utility functions
const readJSON = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

const writeJSON = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// Authentication middleware
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Authorization middleware
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

// Authentication routes
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const users = await readJSON(usersPath);
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    const users = await readJSON(usersPath);
    
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: 'student', // Default role
      favorites: [],
      playlists: [],
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await writeJSON(usersPath, users);
    
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Profile route
app.get('/api/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await readJSON(usersPath);
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove sensitive information
    const { password, ...safeUser } = user;
    
    // Prepare response object
    const profileData = { user: safeUser };

    // Role-specific data
    if (user.role === 'student') {
      // Get student's playlists
      const playlists = await readJSON(playlistsPath);
      profileData.playlists = playlists.filter(p => p.userId === userId);
      
      // Get student's submissions
      const submissions = await readJSON(submissionsPath);
      profileData.submissions = submissions.filter(s => s.userId === userId);
      
      // Get favorite problems
      const problems = await readJSON(problemsPath);
      profileData.favorites = problems.filter(p => 
        user.favorites && user.favorites.includes(p.id)
      );
    }
    
    else if (user.role === 'teacher') {
      // Get teacher's classes
      const classes = await readJSON(classesPath);
      profileData.classes = classes.filter(c => c.teacherId === userId);
      
      // Get problems created by teacher
      const problems = await readJSON(problemsPath);
      profileData.problems = problems.filter(p => p.createdBy === userId);
    }
    
    else if (user.role === 'admin') {
      // Get all users (without passwords)
      const allUsers = await readJSON(usersPath);
      profileData.users = allUsers.map(({ password, ...u }) => u);
      
      // Get basic statistics
      const problems = await readJSON(problemsPath);
      const submissions = await readJSON(submissionsPath);
      const classes = await readJSON(classesPath);
      
      profileData.stats = {
        totalUsers: allUsers.length,
        totalProblems: problems.length,
        totalSubmissions: submissions.length,
        totalClasses: classes.length
      };
    }

    res.json(profileData);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile data' });
  }
});

// Problems routes
app.get('/api/problems', async (req, res) => {
  try {
    const problems = await readJSON(problemsPath);
    res.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

app.get('/api/problems/:id', async (req, res) => {
  try {
    const problems = await readJSON(problemsPath);
    const problem = problems.find(p => p.id === req.params.id);
    
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    
    res.json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
});

// Submissions routes
app.post('/api/submissions', authenticate, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    
    if (!problemId || !code) {
      return res.status(400).json({ error: 'Problem ID and code are required' });
    }
    
    const submission = {
      id: Date.now().toString(),
      userId: req.user.id,
      problemId,
      code,
      language: language || 'javascript',
      status: Math.random() > 0.3 ? 'accepted' : 'rejected', // Simple simulation
      runtime: Math.floor(Math.random() * 200) + 'ms',
      createdAt: new Date().toISOString()
    };
    
    const submissions = await readJSON(submissionsPath);
    submissions.push(submission);
    await writeJSON(submissionsPath, submissions);
    
    res.status(201).json(submission);
  } catch (error) {
    console.error('Error submitting code:', error);
    res.status(500).json({ error: 'Failed to submit code' });
  }
});

app.get('/api/submissions/user/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only allow users to see their own submissions (except admins)
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const submissions = await readJSON(submissionsPath);
    const userSubmissions = submissions.filter(s => s.userId === userId);
    
    res.json(userSubmissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Admin routes
app.put('/api/admin/users/:userId/role', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!role || !['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ 
        error: 'Valid role required (student, teacher, or admin)' 
      });
    }
    
    const users = await readJSON(usersPath);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    users[userIndex].role = role;
    await writeJSON(usersPath, users);
    
    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

