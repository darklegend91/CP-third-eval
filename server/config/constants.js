// config/constants.js

// User roles
const ROLES = {
    GUEST: 'guest',
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin'
  };
  
  // Permission hierarchy
  const PERMISSION_LEVELS = {
    [ROLES.GUEST]: 0,
    [ROLES.STUDENT]: 1,
    [ROLES.TEACHER]: 2,
    [ROLES.ADMIN]: 3
  };
  
  // Features by role
  const PERMISSIONS = {
    // What users can do based on role
    VIEW_PROBLEMS: [ROLES.GUEST, ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN],
    JOIN_CLASS: [ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN],
    CREATE_PLAYLIST: [ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN],
    SUBMIT_SOLUTION: [ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN],
    CREATE_CLASS: [ROLES.TEACHER, ROLES.ADMIN],
    VIEW_SUBMISSIONS: [ROLES.TEACHER, ROLES.ADMIN],
    MANAGE_PROBLEMS: [ROLES.TEACHER, ROLES.ADMIN],
    MANAGE_USERS: [ROLES.ADMIN]
  };
  
  // File paths 
  const FILE_PATHS = {
    USERS: '../models/users.json',
    PROBLEMS: '../models/problems.json',
    SUBMISSIONS: '../models/submissions.json',
    CLASSES: '../models/classes.json',
    PLAYLISTS: '../models/playlists.json'
  };
  
  module.exports = {
    ROLES,
    PERMISSION_LEVELS,
    PERMISSIONS,
    FILE_PATHS
  };
  