process.env.TZ = 'GMT'

module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': { tsconfig: 'tsconfig.spec.json' },
  },
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ['jest-extended'],
  testEnvironment: 'node',

  collectCoverageFrom: ['./src/**/*.ts', '!**/*.spec.ts', '!**/*.mock.ts'],
}
