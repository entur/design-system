module.exports = {
  moduleNameMapper: {
    '.(css|less|sass|scss)$': '<rootDir>/../../__mocks__/styleMock.js',
    '^@entur/utils$': '<rootDir>/../../packages/utils/src',
    '^@entur/loader$': '<rootDir>/../../packages/loader/src',
    '^@entur/icons$': '<rootDir>/../../packages/icons/dist',
    '^@entur/typography$': '<rootDir>/../../packages/typography/src',
    '^@entur/button$': '<rootDir>/../../packages/button/src',
    '^@entur/chip$': '<rootDir>/../../packages/chip/src',
    '^@entur/form$': '<rootDir>/../../packages/form/src',
    '^@entur/modal$': '<rootDir>/../../packages/modal/src',
    '^@entur/tooltip$': '<rootDir>/../../packages/tooltip/src',
    '^@entur/alert$': '<rootDir>/../../packages/alert/src',
    '^@entur/menu$': '<rootDir>/../../packages/menu/src',
    '^@entur/travel$': '<rootDir>/../../packages/travel/src',
    '^@entur/table$': '<rootDir>/../../packages/table/src',
    '^@entur/datepicker$': '<rootDir>/../../packages/datepicker/src',
    '^@entur/dropdown$': '<rootDir>/../../packages/dropdown/src',
    '^@entur/fileupload$': '<rootDir>/../../packages/fileupload/src',
    '^@entur/layout$': '<rootDir>/../../packages/layout/src',
    '^@entur/expand$': '<rootDir>/../../packages/expand/src',
    '^@entur/grid$': '<rootDir>/../../packages/grid/src',
    '^@entur/tab$': '<rootDir>/../../packages/tab/src',
    '^@entur/a11y$': '<rootDir>/../../packages/a11y/src',
    '^@entur/tokens$': '<rootDir>/../../packages/tokens/dist/tokens.cjs.js',
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
