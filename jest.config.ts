import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json'
        }
    },
    testMatch: ["**/tests/**/*.test.ts"]
};

export default config;
