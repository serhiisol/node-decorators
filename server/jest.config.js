module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.test.json'
      },
    ],
  },
  moduleNameMapper: {
    '^@server$': '<rootDir>/src/index.ts',
    '^@server\/express$': '<rootDir>/src/platforms/express/index.ts',
  },
};
