const path = require('path');
const fileUtils = require('../utils/fileUtils');
const { ROLES } = require('../config/constants');

const classesFilePath = path.join(__dirname, '../models/classes.json');
const usersFilePath = path.join(__dirname, '../models/users.json');

exports.getClasses = (req, res) => {
  fileUtils.readJSON(classesFilePath, (err, classes) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading classes data.' });
    }
    
    if (req.user.role === ROLES.ADMIN) {
      // Admins can see all classes
      return res.status(200).json(classes);
    } else if (req.user.role === ROLES.TEACHER) {
      // Teachers can see classes they created
      const teacherClasses = classes.filter(c => c.teacherId === req.user.id);
      return res.status(200).json(teacherClasses);
    } else {
      // Students can see classes they're enrolled in
      const studentClasses = classes.filter(c => c.students && c.students.includes(req.user.id));
      return res.status(200).json(studentClasses);
    }
  });
};

exports.getClassById = (req, res) => {
  const classId = req.params.id;
  
  fileUtils.readJSON(classesFilePath, (err, classes) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading classes data.' });
    }
    
    const classData = classes.find(c => c.id == classId);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found.' });
    }
    
    // Check permissions
    const isTeacher = classData.teacherId === req.user.id;
    const isStudent = classData.students && classData.students.includes(req.user.id);
    const isAdmin = req.user.role === ROLES.ADMIN;
    
    if (!isTeacher && !isStudent && !isAdmin) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    
    return res.status(200).json(classData);
  });
};

exports.createClass = (req, res) => {
  const { name, description, problems } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Class name is required.' });
  }
  
  const newClass = {
    id: Date.now().toString(),
    name,
    description: description || '',
    teacherId: req.user.id,
    students: [],
    problems: problems || [],
    createdAt: new Date().toISOString()
  };
  
  fileUtils.readJSON(classesFilePath, (err, classes) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading classes data.' });
    }
    
    classes.push(newClass);
    
    fileUtils.writeJSON(classesFilePath, classes, err => {
      if (err) {
        return res.status(500).json({ error: 'Error saving class data.' });
      }
      return res.status(201).json(newClass);
    });
  });
};

exports.updateClass = (req, res) => {
  const classId = req.params.id;
  const updates = req.body;
  
  fileUtils.readJSON(classesFilePath, (err, classes) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading classes data.' });
    }
    
    const index = classes.findIndex(c => c.id == classId);
    if (index === -1) {
      return res.status(404).json({ error: 'Class not found.' });
    }
    
    // Only the teacher who created the class or an admin can update it
    if (req.user.role !== ROLES.ADMIN && classes[index].teacherId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update classes you created.' });
    }
    
    // Prevent changing the teacher ID if not admin
    if (req.user.role !== ROLES.ADMIN) {
      delete updates.teacherId;
    }
    
    // Update class
    classes[index] = { 
      ...classes[index], 
      ...updates,
      id: classId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    fileUtils.writeJSON(classesFilePath, classes, err => {
      if (err) {
        return res.status(500).json({ error: 'Error saving class data.' });
      }
      return res.status(200).json(classes[index]);
    });
  });
};

exports.deleteClass = (req, res) => {
  const classId = req.params.id;
  
  fileUtils.readJSON(classesFilePath, (err, classes) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading classes data.' });
    }
    
    const index = classes.findIndex(c => c.id == classId);
    if (index === -1) {
      return res.status(404).json({ error: 'Class not found.' });
    }
    
    // Only the teacher who created the class or an admin can delete it
    if (req.user.role !== ROLES.ADMIN && classes[index].teacherId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete classes you created.' });
    }
    
    // Remove the class
    classes.splice(index, 1);
    
    fileUtils.writeJSON(classesFilePath, classes, err => {
      if (err) {
        return res.status(500).json({ error: 'Error saving class data.' });
      }
      return res.status(200).json({ message: 'Class deleted successfully.' });
    });
  });
};

exports.joinClass = (req, res) => {
  const classId = req.params.id;
  const userId = req.user.id;
  
  fileUtils.readJSON(classesFilePath, (err, classes) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading classes data.' });
    }
    
    const index = classes.findIndex(c => c.id == classId);
    if (index === -1) {
      return res.status(404).json({ error: 'Class not found.' });
    }
    
    // Ensure students array exists
    if (!classes[index].students) {
      classes[index].students = [];
    }
    
    // Check if already joined
    if (classes[index].students.includes(userId)) {
      return res.status(400).json({ error: 'You are already in this class.' });
    }
    
    // Add student to class
    classes[index].students.push(userId);
    
    fileUtils.writeJSON(classesFilePath, classes, err => {
      if (err) {
        return res.status(500).json({ error: 'Error saving class data.' });
      }
      
      // Also update the user's classes array
      fileUtils.readJSON(usersFilePath, (err, users) => {
        if (err) {
          return res.status(500).json({ error: 'Error reading user data.' });
        }
        
        const userIndex = users.findIndex(u => u.id == userId);
        if (userIndex === -1) {
          return res.status(404).json({ error: 'User not found.' });
        }
        
        // Ensure classes array exists
        if (!users[userIndex].classes) {
          users[userIndex].classes = [];
        }
        
        // Add class to user's classes
        users[userIndex].classes.push(classId);
        
        fileUtils.writeJSON(usersFilePath, users, err => {
          if (err) {
            return res.status(500).json({ error: 'Error saving user data.' });
          }
          
          return res.status(200).json({ message: 'Joined class successfully.' });
        });
      });
    });
  });
};
