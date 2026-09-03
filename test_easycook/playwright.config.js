const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./global-setup'),
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'https://easycook-three.vercel.app',
    locale: 'th-TH',
    timezoneId: 'Asia/Bangkok',
    screenshot: 'on',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
});
