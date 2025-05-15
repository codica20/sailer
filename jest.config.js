const { defaults } = require("ts-jest/presets");

const tsJestTransformCfg = defaults.transform;

/** @type {import("jest").Config} **/
module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};
