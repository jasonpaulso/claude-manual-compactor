module.exports = {
  // Test environment for Node.js
  testEnvironment: 'node',

  // Root directory for Jest
  rootDir: '.',

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Directories to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/'
  ],

  // Coverage configuration
  collectCoverage: false,
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!jest.config.js',
    '!eslint.config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Setup files
  setupFilesAfterEnv: [],

  // Module directories
  moduleDirectories: [
    'node_modules',
    '.'
  ],

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Verbose output
  verbose: true,

  // Transform configuration (if needed for future ES6 modules)
  transform: {},

  // Test timeout
  testTimeout: 10000
};