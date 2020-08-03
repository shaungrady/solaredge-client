process.env.TZ = 'GMT'

module.exports = {
  preset: 'ts-jest',
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ['jest-extended'],
  testEnvironment: 'node',
}
