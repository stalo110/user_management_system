import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json' // Pointing to your test-specific tsconfig
        }
    },
    testMatch: ["**/tests/**/*.test.ts"]
};

export default config;

// import type { Config } from 'jest';

// const config: Config = {
//     preset: 'ts-jest',
//     testEnvironment: 'node'
// };

// export default config;
