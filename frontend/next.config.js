const path = require('path');

module.exports = {
    webpack(config, options) {
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