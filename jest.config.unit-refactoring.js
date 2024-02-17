module.exports = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testMatch: [
    '**/auth/src/application/command/**/*.spec.ts',
    '**/token/command/**/*.spec.ts',
    '**/token/query/**/*.spec.ts',
    '**/user/command/**/*.spec.ts',
  ],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^apps/(.*)$': '<rootDir>/apps/$1',
    '^@app/common/(.*)$': '<rootDir>/libs/common/src/$1',
  },
};
