export default {
  preset: 'ts-jest',
  testEnvironment: 'node', // changed to node for auth tests (no DOM needed)
  transform: {
    '\\.(js|jsx|ts|tsx)$': ['ts-jest', { useESM: true }],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!lib/**/*.d.ts',
    '!components/**/*.d.ts',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(.+\\.(js|jsx|ts|tsx)$|@auth/prisma-adapter|next-auth|@auth))',
  ],
};