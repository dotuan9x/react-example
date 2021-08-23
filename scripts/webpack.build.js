const HTMLWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');

const outputFileName = 'js/[name].bundle.js';
const outputChunkFileName = 'js/[name].js';

const publicPath = '/';

module.exports = {
    devtool: false,
    mode: 'production',
    entry: ['@babel/polyfill', paths.appIndex],
    output: {
        path: paths.appBuild,
        filename: outputFileName,
        chunkFilename: outputChunkFileName,
        publicPath
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
    optimization: {
        minimize: true,
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
            filename: 'index.html',
            chunksSortMode: 'none'
        })
    ]
};
