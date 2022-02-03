"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("piral-cli/utils");
const path_1 = require("path");
const bundler_run_1 = require("./bundler-run");
const configs_1 = require("../configs");
const helpers_1 = require("../helpers");
const constants_1 = require("../constants");
function run(root, piral, hmr, externals, publicUrl, entryFiles, logLevel) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, utils_1.setStandardEnvs)({
            root,
            debugPiral: true,
            dependencies: externals,
            piral,
        });
        const otherConfigPath = (0, path_1.resolve)(root, constants_1.defaultWebpackConfig);
        const dist = (0, path_1.resolve)(root, 'dist');
        const hmrPort = hmr ? yield (0, utils_1.getFreePort)(62123) : 0;
        const baseConfig = yield (0, configs_1.getPiralConfig)(entryFiles, dist, externals, true, true, false, false, publicUrl, hmrPort);
        const wpConfig = (0, helpers_1.extendConfig)(baseConfig, otherConfigPath, {
            watch: true,
        });
        return (0, bundler_run_1.runWebpack)(wpConfig, logLevel);
    });
}
let bundler;
process.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const root = process.cwd();
    switch (msg.type) {
        case 'bundle':
            if (bundler) {
                yield bundler.bundle();
                bundler.on('buildStart', () => {
                    process.send({
                        type: 'pending',
                    });
                });
            }
            break;
        case 'start':
            bundler = yield run(root, msg.piral, msg.hmr, msg.externals, msg.publicUrl, msg.entryFiles, msg.logLevel).catch((error) => {
                process.send({
                    type: 'fail',
                    error: error === null || error === void 0 ? void 0 : error.message,
                });
            });
            if (bundler) {
                bundler.on('bundled', () => {
                    process.send({
                        type: 'update',
                        outHash: bundler.mainBundle.entryAsset.hash,
                        outName: 'index.html',
                        args: {
                            root,
                        },
                    });
                });
                process.send({
                    type: 'done',
                    outDir: bundler.options.outDir,
                });
            }
            break;
    }
}));
//# sourceMappingURL=run-debug-piral.js.map