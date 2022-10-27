// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': path.join(
      __dirname,
      '__mocks__',
      'styleMock.js',
    ),
  },
  setupFilesAfterEnv: [path.join(__dirname, 'jest.setup.ts')],
  globalSetup: path.join(__dirname, 'global-setup.js'),
};
