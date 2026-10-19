import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    // example specs the Cypress UI scaffolds on first start
    excludeSpecPattern: [
      'cypress/e2e/1-getting-started/**',
      'cypress/e2e/2-advanced-examples/**',
    ],
  },
})
