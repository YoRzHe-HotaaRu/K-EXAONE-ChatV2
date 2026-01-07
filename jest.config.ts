import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files
    dir: './',
});

const config: Config = {
    displayName: 'K-EXAONE Chat',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/.next/',
        '<rootDir>/__tests__/e2e/',
    ],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/types/**/*',
        '!src/app/api/**/*',
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    testMatch: [
        '**/__tests__/unit/**/*.test.{ts,tsx}',
        '**/__tests__/integration/**/*.test.{ts,tsx}',
    ],
    transformIgnorePatterns: [
        'node_modules/(?!(react-markdown|remark-gfm|unified|bail|trough|vfile|unist-util-stringify-position|mdast-util-from-markdown|micromark|decode-named-character-reference|character-entities|devlop|mdast-util-to-string|mdast-util-gfm|mdast-util-gfm-autolink-literal|mdast-util-gfm-footnote|mdast-util-gfm-strikethrough|mdast-util-gfm-table|mdast-util-gfm-task-list-item|micromark-util-combine-extensions|micromark-extension-gfm|micromark-extension-gfm-autolink-literal|micromark-extension-gfm-footnote|micromark-extension-gfm-strikethrough|micromark-extension-gfm-table|micromark-extension-gfm-task-list-item|ccount|escape-string-regexp|markdown-table)/)',
    ],
};

export default createJestConfig(config);
