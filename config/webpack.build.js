const moment = require('moment-timezone');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const paths = require('./paths');

const version = moment().tz('Asia/Ho_Chi_Minh').format('MMDDHHmm');
const outputFileName = `${version}/js/[name].bundle.js`;
const outputChunkFileName = `${version}/js/[name].js`;

const publicPath = 'https://dotuan9x.github.io/react-typescript-example/';

module.exports = {
    devtool: false,
    mode: 'production',
    entry: ['@babel/polyfill', paths.appIndexTsx],
    output: {
        path: paths.appBuild,
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
            Modules: paths.appSrc + '/modules/',
            Services: paths.appSrc + '/services/'
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
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            {
                test: /\.scss$/,
                exclude: /\.module.(scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.module.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
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
            template: `${paths.appPublic}/index.html`,
            filename: `${version}/index.html`,
            chunksSortMode: 'none'
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: `${version}/sourcemaps/[name].map`
        })
    ]
};
