// utils/modelUtils.js
const path = require('path');
const { readJSONAsync, writeJSONAsync } = require('./fileUtils');
const { FILE_PATHS } = require('../config/constants');

/**
 * Get the absolute file path for a model
 * @param {string} modelType - The model type (e.g., 'USERS')
 * @returns {string} Absolute file path
 */
const getModelPath = (modelType) => {
  return path.join(__dirname, FILE_PATHS[modelType]);
};

/**
 * Get all entities of a model type with optional filtering
 * @param {string} modelType - Model type (e.g., 'USERS')
 * @param {Object} filters - Optional filters to apply
 */
const getAll = async (modelType, filters = {}) => {
  const entities = await readJSONAsync(getModelPath(modelType));
  
  if (Object.keys(filters).length === 0) {
    return entities;
  }
  
  return entities.filter(entity => {
    for (const [key, value] of Object.entries(filters)) {
      if (entity[key] !== value) {
        return false;
      }
    }
    return true;
  });
};

/**
 * Get entity by ID
 * @param {string} modelType - Model type (e.g., 'USERS')
 * @param {string} id - Entity ID
 */
const getById = async (modelType, id) => {
  const entities = await readJSONAsync(getModelPath(modelType));
  return entities.find(entity => entity.id === id) || null;
};

/**
 * Create a new entity
 * @param {string} modelType - Model type (e.g., 'USERS')
 * @param {Object} data - Entity data
 */
const create = async (modelType, data) => {
  const entities = await readJSONAsync(getModelPath(modelType));
  
  const newEntity = {
    ...data,
    id: data.id || Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  entities.push(newEntity);
  await writeJSONAsync(getModelPath(modelType), entities);
  
  return newEntity;
};

/**
 * Update an entity
 * @param {string} modelType - Model type (e.g., 'USERS')
 * @param {string} id - Entity ID
 * @param {Object} updates - Data to update
 */
const update = async (modelType, id, updates) => {
  const entities = await readJSONAsync(getModelPath(modelType));
  const index = entities.findIndex(entity => entity.id === id);
  
  if (index === -1) return null;
  
  entities[index] = { ...entities[index], ...updates };
  await writeJSONAsync(getModelPath(modelType), entities);
  
  return entities[index];
};

/**
 * Delete an entity
 * @param {string} modelType - Model type (e.g., 'USERS') 
 * @param {string} id - Entity ID
 */
const remove = async (modelType, id) => {
  const entities = await readJSONAsync(getModelPath(modelType));
  const filteredEntities = entities.filter(entity => entity.id !== id);
  
  if (filteredEntities.length === entities.length) {
    return false; // Entity not found
  }
  
  await writeJSONAsync(getModelPath(modelType), filteredEntities);
  return true;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
