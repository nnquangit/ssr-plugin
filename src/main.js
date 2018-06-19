const path = require('path')
const fs = require('fs')

class SSRClientPlugin {
    constructor(options = {}) {
        this.options = {filename: 'ssr-client-manifest.json', ...options}
        this.validate(this.options)
    }

    validate(options) {
        let _error = [];

        if ((typeof options.filename !== 'string') || !options.filename.length) {
            _error.push('Missing config `filename` -> new SSRClientPlugin({filename: \'ssr-client-manifest.json\'})')
        }

        if (_error.length) {
            this.error(_error)
        }
    }

    error(msg) {
        throw `
******************** SSRClientPlugin ********************
${msg.join("\n\r")}
*********************************************************`
    }

    apply(compiler) {
        let {filename} = this.options;


        compiler.hooks.emit.tap("SSRClientPlugin", function (compilation, cb) {
            let stats = compilation.getStats().toJson();
            let assets = [];
            Object.values(stats.entrypoints).map(v => assets = [...assets, ...v.assets])
            let data = {
                publicPath: stats.publicPath,
                assets: assets,
                css: assets.filter(name => name.match(/\.css$/)),
                js: assets.filter(name => name.match(/\.js$/))
            }
            if (compiler.outputFileSystem && compiler.outputFileSystem.mkdirpSync) {
                compiler.outputFileSystem.mkdirpSync(stats.outputPath);
                compiler.outputFileSystem.writeFileSync(path.join(stats.outputPath, filename), JSON.stringify(data));
            } else {
                fs.writeFileSync(path.join(stats.outputPath, filename), JSON.stringify(data));
            }
            return cb
        });
    }
}

class SSRServerPlugin {

    validate(options) {
        let _error = [];

        if (options.target !== 'node') {
            _error.push('Webpack config `target` -> should be config with "node"')
        }

        if (typeof options.entry !== 'string') {
            _error.push('Webpack config `entry` -> should be config with string path (one entrypoint)')
        }

        if (options.output.libraryTarget !== 'commonjs2') {
            _error.push('Webpack config `output.libraryTarget` -> should be config with "commonjs2"')
        }

        if (_error.length) {
            this.error(_error)
        }
    }

    error(msg) {
        throw `
******************** SSRServerPlugin ********************
${msg.join("\n\r")}
*********************************************************`
    }

    apply(compiler) {
        let wpoptions = compiler.options;

        this.validate(wpoptions)
    }
}

module.exports = {SSRClientPlugin, SSRServerPlugin}