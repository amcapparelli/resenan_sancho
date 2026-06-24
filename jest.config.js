const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Points to the Next.js app root so next/jest can load next.config.js and .env files
  dir: './',
});

/** @type {import('jest').Config} */
const customConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Tests are co-located with the code under src/.
  roots: ['<rootDir>/src'],
};

// next/jest wraps the custom config and applies SWC transform + CSS/image mocks
module.exports = createJestConfig(customConfig);
