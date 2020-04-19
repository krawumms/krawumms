const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    env: {
        SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
        SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
        SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
        API_BASE_URL: process.env.API_BASE_URL,
        UI_BASE_URL: process.env.UI_BASE_URL,
    },
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