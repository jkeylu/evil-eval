const webpack = require('webpack');

module.exports = {
    mode: 'production',
    target: 'node',
    entry: {
        main: './src/index.ts'
    },
    output: {
        filename: 'evil-eval.min.js',
        path: __dirname + '/dist',
        libraryTarget: 'commonjs'
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
};
