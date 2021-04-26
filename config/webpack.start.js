const webpack = require('webpack');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const publicPath = '/';

// Config HTTP/HTTPS
const https = true;
const protocol = https ? 'https' : 'http';

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
    entry: ['@babel/polyfill', paths.appIndexTsx],
    output: {
        path: paths.appBuild,
        filename: 'static/js/bundle.js',
        chunkFilename: '[name].js',
        publicPath: publicPath,
        crossOriginLoading: 'anonymous'
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
            react: require.resolve('react')
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
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    cacheDirectory: true,
                    presets: ['@babel/preset-react']
                }
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
                use: ['style-loader', 'css-loader']
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
                    loader: 'file-loader'
                }]
            },
            {
                test: /\.svg$/,
                use: [{
                    loader: 'file-loader'
                }]
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: './json/[name].[ext]'
                    }
                }]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: [{
                    loader: 'file-loader'
                }]
            }
        ]
    },
    devServer: getDevServerConfig(https),
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(false),
            SITE_URL: JSON.stringify(protocol + '://localhost:8080/'),
            LOGO_MAIN: JSON.stringify(protocol + '://c0-vcdn.anthill.vn/logo/ants.png'),
            LOGO_SUB: JSON.stringify(protocol + '://c0-vcdn.anthill.vn/logo/ants-left.png'),
            ASSETS_URL: JSON.stringify(protocol + '://localhost:8080/'),
            API_HOST: JSON.stringify(protocol + '://vinhpx.antalyser.adxdev.vn/api/'),
            API_HOST_V3: JSON.stringify(protocol + '://thinhdnp.antalyser.adxdev.vn/v3.1/api/'),
            API_LOGGING: JSON.stringify(protocol + '://v1.logging.adx.ants.vn/logging'),
            API_LOGGING_ERROR: JSON.stringify(protocol + '://thinhdnp.v3.adxdev.vn/logging/v3.1/'),
            ADX_SITE_URL: JSON.stringify(protocol + '://vinhpx.a1.adxdev.vn/v3/'),
            ADX_API_HOST: JSON.stringify(protocol + '://thanghn.a1.adxdev.vn/v3/api/'),
            ADX_API_HOST_V3: JSON.stringify(protocol + '://thinhdnp.a1.adxdev.vn/v3.1/api/'),
            PACKAGE_API_HOST: JSON.stringify(protocol + '://vinhpx.package.admin.adxdev.vn/api/'),
            API_ID: JSON.stringify('10507'),
            ST_VERSION: JSON.stringify('1478967892'),
            PROJECT_ID: JSON.stringify('2E4WptU6ChYuajgVBHSJetVLa6FVQMRmK'),
            U_OGS: JSON.stringify('uogs_dev'),
            AUTH_ADX_DOMAIN: JSON.stringify(protocol + '://khanhhv.ogs.adxdev.vn/'),
            ST_OGS: JSON.stringify(protocol + '://khanhhv.st.ogs.adxdev.vn/'),
            ST_URL_UPLOAD: JSON.stringify(protocol + '://tuandv.st.antalyser.adxdev.vn'),
            APPLICATION_ENV: JSON.stringify('development'),
            ANTALYSER_MODULE: JSON.stringify('4'),
            LANGUAGE: JSON.stringify('en'),
            DEVICE: JSON.stringify('mobile'),
            IS_IFRAME: JSON.stringify(0),
            MONITOR_PID: JSON.stringify('1583815897211'),
            THEME: JSON.stringify('')
        }),
        new HTMLWebpackPlugin({
            template: paths.appPublic + '/index.html',
            filename: './index.html',
            chunksSortMode: 'none'
        })
    ]
};