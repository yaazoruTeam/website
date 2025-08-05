import type { Config } from 'jest'


const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/tests/jest.setup.ts'],
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '^@model$': '<rootDir>/../model/src',
    '^@model/(.*)$': '<rootDir>/../model/src/$1',
    '^@db$': '<rootDir>/src/db',
    '^@db/(.*)$': '<rootDir>/src/db/$1',
    '^@service/(.*)$': '<rootDir>/src/service/$1',
    '^@controller/(.*)$': '<rootDir>/src/controller/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default config
