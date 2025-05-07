module.exports = {
  preset: 'ts-jest',        // for jest to understand TypeScript
  testEnvironment: 'node',  // Node.js for testing server side code
  moduleNameMapper: {       // for jest to resolve the '@/*' imports
    '^@/(.*)$': '<rootDir>/$1'
  },
  coverageDirectory: 'tests/__output__',   // Coverage Configuration

  testPathIgnorePatterns: [     // directory to ignore when looking for test files
    '/node_modules/',
    '/__output__/',
    '/coverage/'
  ]
}