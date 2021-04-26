const moment = require('moment');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MyCustomPlugin = require('./webpack.plugin');
const paths = require('./paths');

const version = moment().format('MMDDHHmm');
const outputFileName = `${version}/js/[name].bundle.js`;
const outputChunkFileName = `${version}/js/[name].js`;
const publicPath = '//tuandv.st.antalyser.adxdev.vn/development/';

module.exports = {
    devtool: false,
    mode: 'production',
    entry: ['@babel/polyfill', paths.appIndexTsx],
    output: {
        path: paths.appDevelopment,
        filename: outputFileName,
        chunkFilename: outputChunkFileName,
        publicPath
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
        alias: {
            Src: paths.appSrc,
            Assets: paths.appSrc + '/assets/',
            Components: paths.appSrc + '/components/',
            Hooks: paths.appSrc + '/hooks/',
            Modules: paths.appSrc + '/modules/',
            Services: paths.appSrc + '/services/',
            Locale: paths.appSrc + '/locale/',
            Explorer: paths.appSrc + '/modules/Report/containers/Explorer/',
            Testing: './testing/'
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.scss$/,
                exclude: /\.module.(scss)$/,
                use: [
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.module.scss$/,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: 'ants-[local]-[hash:base64:5]',
                            camelCase: true,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `./${version}/images/[contenthash].[ext]`
                    }
                }]
            },
            {
                test: /\.svg$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `./${version}/svg/[contenthash].[ext]`
                    }
                }]
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `./${version}/json/[contenthash].[ext]`
                    }
                }]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `./${version}/fonts/[contenthash].[ext]`
                    }
                }]
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            cache: true,
            parallel: 4,
            sourceMap: true,
            extractComments: false
        })],
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,
                // Vendor chunk
                vendor: {
                    // Name of the chunk
                    name: 'vendor',
                    // Async + async chunks
                    chunks: 'all',
                    // Import file path containing node_modules
                    test: /node_modules/,
                    priority: 20
                },
                common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'all',
                    priority: 10,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        }
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: 'Development',
            chunksSortMode: 'none'
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: `${version}/sourcemaps/[name].map`
        }),
        new MyCustomPlugin({
            version,
            folder: 'development',
            target: [
                {
                    targetName: /vendor.*.js/,
                    finalName: '../../vendor.js'
                },
                {
                    targetName: /main.bundle.js/,
                    finalName: '../../main.bundle.js'
                }
            ]
        })
    ]
};
