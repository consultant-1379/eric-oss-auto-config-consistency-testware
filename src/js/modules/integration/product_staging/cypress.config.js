/*
 * COPYRIGHT Ericsson 2023
 *
 *
 *
 * The copyright to the computer program(s) herein is the property of
 *
 * Ericsson Inc. The programs may be used and/or copied only with written
 *
 * permission from Ericsson Inc. or in accordance with the terms and
 *
 * conditions stipulated in the agreement/contract under which the
 *
 * program(s) have been supplied.
 */
//ported from eacc version 1.494
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'eacc-product-staging-ui',
  retries: 2,
  e2e: {
    reporter: 'cypress/reporter',
    experimentalRunAllSpecs: true,
    testIsolation: false,
    screenshotOnRunFailure: false,
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
