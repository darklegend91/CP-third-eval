// const path = require('path');
// const jwt = require('jsonwebtoken');
// const fileUtils = require('../utils/fileUtils');

// const usersFilePath = path.join(__dirname, '../models/users.json');
// const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';

// exports.signup = (req, res) => {
//   const { name, email, password, ...rest } = req.body;
  
//   if (!name || !email || !password) {
//     return res.status(400).json({ error: 'Name, email, and password are required.' });
//   }
  
//   // Read existing users
//   fileUtils.readJSON(usersFilePath, (err, users) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error reading user data.' });
//     }
    
//     // Check if email already exists
//     if (users.find(u => u.email === email)) {
//       return res.status(400).json({ error: 'Email already registered.' });
//     }
    
//     // Create a new user object
//     const newUser = {
//       id: Date.now(),
//       name,
//       email,
//       password,
//       role: 'student', // Default role
//       ...rest,
//       favorites: [],
//       groups: []
//     };
    
//     users.push(newUser);
    
//     // Save updated user data
//     fileUtils.writeJSON(usersFilePath, users, err => {
//       if (err) {
//         return res.status(500).json({ error: 'Error saving user data.' });
//       }
      
//       // Generate JWT token
//       const token = jwt.sign(
//         { id: newUser.id, email: newUser.email, role: newUser.role },
//         JWT_SECRET,
//         { expiresIn: '24h' }
//       );
      
//       return res.status(201).json({ 
//         message: 'User registered successfully',
//         token,
//         user: {
//           id: newUser.id,
//           name: newUser.name,
//           email: newUser.email,
//           role: newUser.role
//         }
//       });
//     });
//   });
// };

// exports.login = (req, res) => {
//   const { email, password } = req.body;
  
//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required.' });
//   }
  
//   // Read users data
//   fileUtils.readJSON(usersFilePath, (err, users) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error reading user data.' });
//     }
    
//     const user = users.find(u => u.email === email && u.password === password);
    
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials.' });
//     }
    
//     // Ensure user has a role (backward compatibility)
//     if (!user.role) {
//       user.role = 'student';
//     }
    
//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );
    
//     return res.status(200).json({ 
//       message: 'Login successful.',
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   });
// };
const path = require('path');
const fileUtils = require('../utils/fileUtils');
const jwt = require('jsonwebtoken');
const usersPath = path.join(__dirname, '../../models/users.json');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await fileUtils.readJSON(usersPath);
    
    // Fix user data structure - remove nested array
    const user = users.flat().find(u => u.email === email && u.password === password);
    
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Remove sensitive data before sending response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};
