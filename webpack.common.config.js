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
                title: "Tunga | Unleashing Africa's Tech Talent",
                description: "Small and large businesses from all over the world use Tunga for hiring African software engineers to address their most pressing software development needs.",
                images: {
                    hero: 'https://tunga.io/icons/tunga_hero_devs_working.jpg'
                },
                colors: {
                    primary: '#f41152'
                },
                fb_app_id: '518348818336672',
                optimizely_id: process.env.NODE_ENV?(process.env.NODE_ENV == 'production' && process.env.ANALYTICS_ENV != "development"?'8175822119':'8182460702'):'',
                ga_tracker: process.env.NODE_ENV?(process.env.NODE_ENV == 'production'?(process.env.ANALYTICS_ENV == "development"?'UA-102018659-1':'UA-70644715-1'):''):'',
                gtm_tracker: process.env.NODE_ENV?(process.env.NODE_ENV == 'production'?(process.env.ANALYTICS_ENV == "development"?'GTM-KKS9DVD':'GTM-PDS4Q4'):''):'',
                enable_tracking: process.env.NODE_ENV == 'production' && process.env.ANALYTICS_ENV != "development"
            }
        }),
        noErrorsPlugin: new webpack.NoErrorsPlugin(),
        magicGlobalsPlugin: new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true') && process.env.NODE_ENV != 'production'),
            __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false')),
            __PRODUCTION__: JSON.stringify(process.env.NODE_ENV == 'production'),
            __BACKEND_ROOT_URL__: JSON.stringify(process.env.BACKEND_ROOT),
            __STRIPE_KEY__: JSON.stringify(process.env.NODE_ENV == 'production' && process.env.STRIPE_ENV != 'development'?'pk_live_2AjNhLWO1Cg4nby71Vh01a2T':'pk_test_lUZpYKnVWZ5RbdPcmnBqqE8l')
        }),
        CleanWebpackPlugin: new CleanWebpackPlugin(['build'], {
            root: __dirname,
            verbose: true,
            dry: false
        })
    },
    hash: unixTimestamp
};
