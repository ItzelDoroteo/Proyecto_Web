module.exports = {
    // Otras configuraciones de Jest que necesites
    moduleNameMapper: {
      '\\.(css|less)$': '<rootDir>/src/__tests__/styleMock.js',
    },
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      '^.+\\.css$': 'jest-transform-stub',
      '^.+\\.css$': 'jest-css-modules',
    },
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
      '/node_modules/(?!primeicons|primereact).+\\.js$',
    ],
    
  };
  