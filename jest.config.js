module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  setupFilesAfterEnv: ["<rootDir>/tests/test-setup.ts"],
  transform: {
    "^.+\\.vue$": "vue-jest",
  },
  resetMocks: true,
  restoreMocks: true,
};
