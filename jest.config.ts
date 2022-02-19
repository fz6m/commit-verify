import type { Config } from '@jest/types'

export default {
  testMatch: ['**/src/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'esbuild-jest',
  },
  testTimeout: 30 * 1e3,
} as Config.InitialOptions
