const fs = require('fs');

function validateSplit(value) {
  const num = Number(value);
  if (isNaN(num) || !Number.isInteger(num) || num < 1 || num > 100) {
    throw new Error('Split percentage must be between 1 and 100');
  }
  return num;
}

function validateOverlap(value) {
  if (value === null || value === undefined || value === '') {
    throw new Error('Overlap lines must be between 0 and 99999');
  }
  const num = Number(value);
  if (isNaN(num) || !Number.isInteger(num) || num < 0 || num > 99999) {
    throw new Error('Overlap lines must be between 0 and 99999');
  }
  return num;
}

function validateFile(filepath) {
  if (!fs.existsSync(filepath)) {
    throw new Error(`File not found: ${filepath}`);
  }
  
  const stats = fs.statSync(filepath);
  if (stats.isDirectory()) {
    throw new Error(`Path is a directory, not a file: ${filepath}`);
  }
  
  try {
    fs.accessSync(filepath, fs.constants.R_OK);
  } catch (err) {
    throw new Error(`Cannot read file: ${filepath}`);
  }
  
  return filepath;
}

function validateModel(model) {
  if (model && typeof model !== 'string') {
    throw new Error('Model must be a string');
  }
  if (!model || !model.trim()) {
    return undefined;
  }
  return model.trim();
}

function validateOutputFile(filename) {
  if (!filename || typeof filename !== 'string') {
    throw new Error('Output filename must be a string');
  }
  
  // Check for invalid characters
  const invalidChars = /[<>:"|?*]/;
  if (invalidChars.test(filename)) {
    throw new Error('Output filename contains invalid characters');
  }
  
  return filename;
}

module.exports = {
  validateSplit,
  validateOverlap,
  validateFile,
  validateModel,
  validateOutputFile
};