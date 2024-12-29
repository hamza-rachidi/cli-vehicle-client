/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  testMatch: ["<rootDir>/src/**/?(*.)(spec|test).{ts,tsx}"],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};

