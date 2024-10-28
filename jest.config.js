module.exports = {
    // Otras configuraciones de Jest que necesites
    moduleNameMapper: {
      '\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      '^.+\\.css$': 'jest-transform-stub',
    },
    testEnvironment: 'jsdom',
    
  };
  