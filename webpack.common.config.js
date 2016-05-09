'use strict';

var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    path = require('path');

var unixTimestamp = Date.now();

module.exports = {
    plugins: {
        chunkVendorPlugin: new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js?v='+ unixTimestamp),
        HTMLInjectPlugin: new HtmlWebpackPlugin({
            inject: true,
            template: 'src/index.html'
        }),
        noErrorsPlugin: new webpack.NoErrorsPlugin(),
        magicGlobalsPlugin: new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
            __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
        })
    },
    hash: unixTimestamp
};
