/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  // Plain CommonJS, so nothing needs transpiling.
  transform: {},
};
