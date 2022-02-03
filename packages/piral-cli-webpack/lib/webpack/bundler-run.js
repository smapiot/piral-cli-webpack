"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWebpack = void 0;
const webpack = require("webpack");
const path_1 = require("path");
const events_1 = require("events");
function getOutput(stats) {
    const { outputPath, entrypoints } = stats.toJson();
    for (const name of Object.keys(entrypoints)) {
        const assets = entrypoints[name].assets;
        return (0, path_1.resolve)(outputPath, assets[0]);
    }
}
function getPreset(logLevel) {
    switch (logLevel) {
        case 0: //LogLevels.disabled
            return 'none';
        case 1: //LogLevels.error
            return 'errors-only';
        case 2: //LogLevels.warning
            return 'errors-warnings';
        case 4: //LogLevels.verbose
        case 5: //LogLevels.debug
            return 'verbose';
        case 3: //LogLevels.info
        default:
            return 'normal';
    }
}
function runWebpack(wpConfig, logLevel) {
    const eventEmitter = new events_1.EventEmitter();
    const outDir = wpConfig.output.path;
    const preset = webpack.Stats.presetToOptions(getPreset(logLevel));
    const bundle = {
        outFile: '',
        outDir,
        name: '',
        hash: '',
        requireRef: undefined,
    };
    const updateBundle = (stats) => {
        var _a, _b;
        const file = getOutput(stats);
        bundle.name = (0, path_1.basename)(file);
        bundle.requireRef = (_b = (_a = stats.compilation.outputOptions) === null || _a === void 0 ? void 0 : _a.jsonpFunction) === null || _b === void 0 ? void 0 : _b.replace('_chunks', '');
        bundle.hash = stats.hash;
        bundle.outFile = `/${(0, path_1.basename)(file)}`;
        bundle.outDir = (0, path_1.dirname)(file);
    };
    wpConfig.plugins.push({
        apply(compiler) {
            compiler.hooks.beforeCompile.tap('piral-cli', () => {
                eventEmitter.emit('start');
            });
            compiler.hooks.done.tap('piral-cli', (stats) => {
                updateBundle(stats);
                eventEmitter.emit('end', bundle);
            });
        },
    });
    return {
        bundle() {
            return new Promise((resolve, reject) => {
                webpack(wpConfig, (err, stats) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    else {
                        console.log(stats.toString(Object.assign(Object.assign({}, preset), { colors: true })));
                        if (stats.hasErrors()) {
                            reject(stats.toJson(preset));
                        }
                        else {
                            updateBundle(stats);
                            resolve(bundle);
                        }
                    }
                });
            });
        },
        onStart(cb) {
            eventEmitter.on('start', cb);
        },
        onEnd(cb) {
            eventEmitter.on('end', cb);
        },
    };
}
exports.runWebpack = runWebpack;
//# sourceMappingURL=bundler-run.js.map