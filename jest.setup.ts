import '@testing-library/jest-dom/extend-expect';

// Set timezone to UTC for consistent test results
process.env.TZ = 'UTC';

// We don't want warnings about missing styles in our jest tests
// This will be handled by individual package Jest configs if needed
