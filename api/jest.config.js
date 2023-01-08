module.exports = {
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["js", "json", "ts"],
  preset: "ts-jest",
  reporters: ["default"],
  collectCoverage: false,
  coverageDirectory: "./coverage",
  coveragePathIgnorePatterns: ["./test/"],
  testEnvironment: "node",
  testTimeout: 30000,
};
