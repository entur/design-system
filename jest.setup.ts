import '@testing-library/jest-dom/extend-expect';

// We don't want warnings about missing styles in our jest tests
jest.mock('@entur/utils', () => {
  const original = jest.requireActual('@entur/utils');
  return {
    ...original,
    warnAboutMissingStyles: jest.fn(),
  };
});
