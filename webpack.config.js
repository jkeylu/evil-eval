module.exports = env => {
    const config = {
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

    if (env && env.es5) {
        config.output.filename = 'evil-eval.es5.min.js';
        config.module.rules.unshift({
            test: /\.ts$/,
            loader: 'string-replace-loader',
            options: {
                search: '/evaluate',
                replace: '/evaluate/index.es5'
            }
        });
    }

    return config;
};
