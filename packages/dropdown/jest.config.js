module.exports = {
  moduleNameMapper: {
    '.(css|less|sass|scss)$': '<rootDir>/../../__mocks__/styleMock.js',

    '^@entur/tokens$': '<rootDir>/../../packages/tokens/dist/tokens.cjs.js',
    '^@entur/tokens/(.*)$': '<rootDir>/../../packages/tokens/dist/$1',

    '^@entur/icons$': '<rootDir>/../../packages/icons/dist/index.js',
    '^@entur/icons/(.*)$': '<rootDir>/../../packages/icons/dist/$1',

    '^@entur/([^/]+)/(.*)$': '<rootDir>/../../packages/$1/src/$2',
    '^@entur/([^/]+)$': '<rootDir>/../../packages/$1/src',
  },
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  transform: {
    '^.+.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          baseUrl: '../../',
          paths: {
            '@entur/*': ['packages/*/src'],
          },
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
