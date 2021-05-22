import type { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => ({
  moduleFileExtensions: ['ts', 'js', 'json'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
})
