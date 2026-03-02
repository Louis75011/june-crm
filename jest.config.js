export default {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[jt]sx?$': ['babel-jest', {
            presets: [
                ['@babel/preset-env', { targets: { node: 'current' } }],
                ['@babel/preset-react', { runtime: 'automatic' }]
            ]
        }]
    },
    moduleNameMapper: {
        '\\.module\\.scss$': 'identity-obj-proxy',
        '\\.scss$': 'identity-obj-proxy',
        '\\.css$': 'identity-obj-proxy',
        '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js'
    },
    testMatch: ['<rootDir>/src/**/*.test.{js,jsx}']
};
