module.exports = {
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                ]
            },
            {
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    plugins: [
                        '@babel/plugin-proposal-class-properties',
                    ],
                    presets: [
                        ['@babel/env', {
                            targets: {
                                browsers: ['last 1 version'],
                            },
                        }],
                        '@babel/react',
                    ],
                },
                test: /\.jsx?$/,
            },

        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};
