require('dotenv').config();
let path = require('path');
let fs = require('fs');

let appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
    return path.resolve(appDirectory, relativePath);
}

// Config after eject: we're in ./config/
module.exports = {
    appBuild: resolveApp('build'),
    appDevelopment: resolveApp('../static/development'),
    appSandbox: resolveApp(process.env.STATIC_SANDBOX_FOLDER || 'static'),
    appStaging: resolveApp(process.env.STATIC_STAGING_FOLDER || 'static'),
    appProduction: resolveApp(process.env.STATIC_PRODUCTION_FOLDER || 'static'),
    appProductionSg: resolveApp(process.env.STATIC_PRODUCTION_FOLDER || 'static'),
    appPublic: resolveApp('public'),
    appIndexJs: resolveApp('src/index.js'),
    appIndexTsx: resolveApp('src/index.tsx'),
    appSrc: resolveApp('src')
};
