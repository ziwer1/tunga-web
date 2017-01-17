'use strict';

var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    unixTimestamp = Date.now();

module.exports = {
    plugins: {
        chunkVendorPlugin: new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js?v='+ unixTimestamp),
        HTMLInjectPlugin: new HtmlWebpackPlugin({
            inject: true,
            template: 'src/index.ejs',
            env: process.env.NODE_ENV || 'development',
            hash: true,
            timestamp: unixTimestamp,
            site: {
                title: 'Tunga',
                description: "Tunga is a market network that allows you to build a flexible team of skilled African software programmers, that you can mobilize on-demand.",
                images: {
                    hero: 'https://tunga.io/icons/tunga_hero.png'
                },
                colors: {
                    primary: '#f41152'
                },
                fb_app_id: '518348818336672'
            }
        }),
        noErrorsPlugin: new webpack.NoErrorsPlugin(),
        magicGlobalsPlugin: new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true') && process.env.NODE_ENV != 'production'),
            __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false') && process.env.NODE_ENV != 'production'),
            __PRODUCTION___: JSON.stringify(process.env.NODE_ENV == 'production'),
            __BACKEND_ROOT_URL__: JSON.stringify(process.env.BACKEND_ROOT)
        }),
        CleanWebpackPlugin: new CleanWebpackPlugin(['build'], {
            root: __dirname,
            verbose: true,
            dry: false
        })
    },
    hash: unixTimestamp
};
