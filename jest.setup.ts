import '@testing-library/jest-dom/extend-expect';
import { TextDecoder, TextEncoder } from 'util';

// Set timezone to UTC for consistent test results
process.env.TZ = 'UTC';

// jsdom ships without these globals, but react-dom/server needs them.
// Required by any test that renders through renderToString.
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}

// We don't want warnings about missing styles in our jest tests
// This will be handled by individual package Jest configs if needed
