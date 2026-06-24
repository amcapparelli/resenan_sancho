const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Points to the Next.js app root so next/jest can load next.config.js and .env files
  dir: './',
});

/** @type {import('jest').Config} */
const customConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Only run co-located tests under src/. The legacy tests/ directory predates the
  // Next 9 -> 15 / styled-components migration and depends on removed packages
  // (@material-ui/core, react-test-renderer); it does not run and is excluded here.
  roots: ['<rootDir>/src'],
};

// next/jest wraps the custom config and applies SWC transform + CSS/image mocks
module.exports = createJestConfig(customConfig);
