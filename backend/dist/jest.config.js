"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: 'coverage',
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map