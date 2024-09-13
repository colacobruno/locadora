/** @type {import('jest').Config} */
const config = {
  restoreMocks: true,
  passWithNoTests: true,
  collectCoverage: true,
  coverageReporters: ['html', 'lcov', 'text', 'text-summary'],
  coverageDirectory: 'test-reports',
  collectCoverageFrom: [
    'api/**/*.js',
    '!api/config/**/*',
    '!api/core/consts/**/*',
    '!api/core/test-helpers/**/*'
  ],
  coverageThreshold: {
    // global: {
    //   branches: 80,
    //   functions: 80,
    //   lines: 80,
    //   statements: 80,
    // },
  }
}

module.exports = config
