import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: "jest-environment-jsdom",
  setupFiles: ['<rootDir>/polyfill.ts'], // Polyfill עבור TextEncoder ו-TextDecoder
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], 
  // moduleNameMapper: {
  //   '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock עבור קבצי CSS
  //   '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/fileMock.ts', // Mock עבור קבצים סטטיים
  // },
  // transformIgnorePatterns: [
  //   'node_modules/(?!(identity-obj-proxy)/)', // התעלמות מקבצים ב-node_modules
  //   '\\.css$', // התעלמות מקבצי CSS
  // ],
  // testPathIgnorePatterns: [
  //   '<rootDir>/node_modules/', // התעלמות מבדיקות ב-node_modules
  //   '<rootDir>/dist/', // התעלמות מתיקיית build
  // ],
    // ...הגדרות אחרות...
    testMatch: ['<rootDir>/src/**/*.test.(ts|tsx)'], // בדיקות רק בתיקיית src
};

export default config;