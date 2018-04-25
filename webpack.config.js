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
            test: /evaluate\/index\.ts$/,
            loader: 'string-replace-loader',
            options: {
                multiple: [
                    { search: '^.*?ES201\\d.*?es201\\d.*$', replace: '', flags: 'gm', strict: true },
                    { search: '^.*?es201\\d.*?ES201\\d.*$', replace: '', flags: 'gm', strict: true },
                    { search: '^.*?\'\\d\'.*es201\\d.*$', replace: '', flags: 'gm', strict: true }
                ]
            }
        });
    }

    return config;
};
