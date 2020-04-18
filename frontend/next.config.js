const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    webpack(config, options) {
        config.plugins.push(new Dotenv({ silent: true }));

        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: 'babel-loader',
                },
                {
                    loader: 'react-svg-loader',
                    options: {
                        jsx: true,
                    },
                },
            ],
        });

        return config;
    },
};