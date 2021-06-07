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
    appPublic: resolveApp('public'),
    appIndexTsx: resolveApp('src/index.tsx'),
    appSrc: resolveApp('src')
};
