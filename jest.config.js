process.env.TZ = 'UTC'

module.exports = {
	preset: 'ts-jest',
	globals: {
		'ts-jest': { tsconfig: './tsconfig.spec.json' },
	},
	setupFilesAfterEnv: ['jest-extended', './jest.setup.js'],
	testEnvironment: 'node',

	collectCoverageFrom: [
		'./src/**/*.ts',
		'!**/*.spec.*',
		'!**/*.mock.*',
		'!**/test/',
	],
}
