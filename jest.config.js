/* Separate config file is needed for the packages base config since <rootDir> is 
   different when running tests from root and in a package folder.
   Make sure to update config both places when making changes! */
module.exports = {
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  globalSetup: '<rootDir>/jest.global.setup.js',
  testEnvironment: 'jest-environment-jsdom',
};
