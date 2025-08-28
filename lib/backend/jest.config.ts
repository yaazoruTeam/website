import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/tests/jest.setup.ts'],
  setupFilesAfterEnv: [],
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs'
      }
    }],
  },
  moduleNameMapper: {
    '^@model$': '<rootDir>/../model/src',
    '^@model/(.*)$': '<rootDir>/../model/src/$1',
    '^@db$': '<rootDir>/src/db',
    '^@db/(.*)$': '<rootDir>/src/db/$1',
    '^@service/(.*)$': '<rootDir>/src/service/$1',
    '^@controller/(.*)$': '<rootDir>/src/controller/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@tranzila/(.*)$': '<rootDir>/src/tranzila/$1',
    '^@integration/(.*)$': '<rootDir>/src/integration/$1',
    '^@/(.*)$': '<rootDir>/$1',
    '^@google-cloud/speech$': '<rootDir>/src/tests/__mocks__/@google-cloud/speech.ts',
  },
}

export default config
