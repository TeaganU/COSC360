module.exports = {
  roots: ["<rootDir>/tests"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.js"],
};
