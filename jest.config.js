module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  modulePaths: ['<rootDir>/src'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/app/_components/$1',
    '^@lib/(.*)$': '<rootDir>/src/app/_lib/$1',
    '^@hooks/(.*)$': '<rootDir>/src/app/_hooks/$1',
    '^@contexts/(.*)$': '<rootDir>/src/app/_contexts/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
  },
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
};