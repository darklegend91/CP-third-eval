// server/utils/users.js
const path = require('path');
const fs = require('fs').promises;

const usersPath = path.join(__dirname, '../models/users.json');

exports.readUsers = async () => {
  try {
    const data = await fs.readFile(usersPath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

exports.writeUsers = async (users) => {
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
};
