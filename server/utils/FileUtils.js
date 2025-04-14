// utils/fileUtils.js
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Promisified file operations
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

/**
 * Read JSON file asynchronously
 * @param {string} filePath - Path to JSON file
 * @returns {Promise<Array|Object>} - Parsed JSON data
 */
const readJSONAsync = async (filePath) => {
  try {
    const data = await readFileAsync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File doesn't exist, return empty array
      return [];
    }
    throw err;
  }
};

/**
 * Write JSON file asynchronously
 * @param {string} filePath - Path to JSON file
 * @param {Array|Object} data - Data to write
 * @returns {Promise<void>}
 */
const writeJSONAsync = async (filePath, data) => {
  await writeFileAsync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

/**
 * Legacy read JSON (callback-based for backward compatibility)
 */
exports.readJSON = (filePath, callback) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return callback(null, []);
      }
      return callback(err);
    }
    try {
      const json = data ? JSON.parse(data) : [];
      return callback(null, json);
    } catch (parseErr) {
      return callback(parseErr);
    }
  });
};

/**
 * Legacy write JSON (callback-based for backward compatibility)
 */
exports.writeJSON = (filePath, data, callback) => {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', callback);
};

// Add the new async methods
exports.readJSONAsync = readJSONAsync;
exports.writeJSONAsync = writeJSONAsync;
