module.exports = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testMatch: ['**/auth/command/**/*.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
};
