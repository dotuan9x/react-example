const webpack = require('webpack');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const publicPath = '/';

// Config HTTP/HTTPS
const https = false;

const getDevServerConfig = (https) => {
    let devServer = {
        hot: true,
        historyApiFallback: true,
        https: https
    };

    if (https) {
        devServer = {
            ...devServer,
            key: fs.readFileSync('config/ssl/server.key'),
            cert: fs.readFileSync('config/ssl/server.crt'),
            ca: fs.readFileSync('config/ssl/rootCA.pem')
        };
    }

    return devServer;
};

module.exports = {
    devtool: 'cheap-module-source-map',
    mode: 'development',
    entry: ['@babel/polyfill', paths.appIndex],
    output: {
        path: paths.appBuild,
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: publicPath,
        crossOriginLoading: 'anonymous'
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
        alias: {
            Src: paths.appSrc
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
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }
        ]
    },
    devServer: getDevServerConfig(https),
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false,
                defaultVendors: false,
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
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(false)
        }),
        new HTMLWebpackPlugin({
            template: paths.appPublic + '/index.html',
            filename: './index.html',
            chunksSortMode: 'none'
        })
    ]
};
