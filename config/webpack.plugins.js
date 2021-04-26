require('dotenv').config();
const axios = require('axios');

module.exports = class MyCustomPlugin {
    constructor(options) {
        this.options = {
            ...options
        };
    }

    apply(compiler) {
        compiler.hooks.emit.tap('MyCustomPlugin', (compilation) => {
            const {assets} = compilation;
            const {target} = this.options;

            target.map((item) => {
                const {targetName, finalName} = item;

                // Filter array files matching with input regex
                const targetFiles = Object.keys(assets).filter((fileName) => {
                    return new RegExp(targetName).test(fileName);
                });

                // Create new file with name inputted, then remove matched file
                targetFiles.forEach((fileName) => {
                    assets[fileName.replace(targetName, finalName)] = assets[fileName];
                    delete assets[fileName];
                });
            });
        });

        compiler.hooks.afterEmit.tap('afterEmit', (compilation) => {
            const {version} = this.options;

            if (version && process.env.ENV && process.env.API_VERSION_HOST) {
                // Change version after build source code
                axios.put(process.env.API_VERSION_HOST, {
                    env: process.env.ENV,
                    version
                });
            }
        });
    }
};
