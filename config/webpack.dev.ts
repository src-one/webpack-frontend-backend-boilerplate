import { getFrontendConfig } from './webpack.common.frontend';
import { getServerConfig } from './webpack.common.server';
import { Environment } from './webpack';

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

export const getDevelopmentConfig = (env: Environment) => {
    return [
        webpackMerge(getFrontendConfig(env), {
            devServer: {
                contentBase: path.join(__dirname, '../build/public'),
                compress: true,
                port: 3000
            }
        }),

        webpackMerge(getServerConfig(env), {
        })
    ];
};