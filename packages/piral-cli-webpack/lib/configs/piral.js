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
exports.getPiralConfig = void 0;
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const html5_entry_webpack_plugin_1 = require("html5-entry-webpack-plugin");
const piral_instance_webpack_plugin_1 = require("piral-instance-webpack-plugin");
const common_1 = require("./common");
function getPiralConfig(template, dist, externals, develop = false, sourceMaps = true, contentHash = true, minimize = true, publicPath = '/', hmr = 0, progress = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const production = !develop;
        const name = process.env.BUILD_PCKG_NAME;
        const version = process.env.BUILD_PCKG_VERSION;
        return {
            devtool: sourceMaps ? (develop ? 'cheap-module-source-map' : 'source-map') : false,
            mode: develop ? 'development' : 'production',
            entry: {
                main: [...(0, common_1.getHmrEntry)(hmr), template],
            },
            output: {
                publicPath,
                path: dist,
                filename: `index.${contentHash ? '[hash:6].' : ''}js`,
                chunkFilename: contentHash ? '[chunkhash:6].js' : undefined,
            },
            resolve: {
                extensions: common_1.extensions,
            },
            module: {
                rules: (0, common_1.getRules)(production),
            },
            optimization: {
                minimize,
                minimizer: [
                    new TerserPlugin({
                        extractComments: false,
                        terserOptions: {
                            ie8: true,
                        },
                    }),
                    new OptimizeCSSAssetsPlugin({}),
                ],
            },
            plugins: (0, common_1.getPlugins)([
                new html5_entry_webpack_plugin_1.Html5EntryWebpackPlugin(),
                new piral_instance_webpack_plugin_1.PiralInstanceWebpackPlugin({
                    name,
                    version,
                    externals,
                    variables: (0, common_1.getVariables)(),
                }),
            ], progress, production, false, hmr),
        };
    });
}
exports.getPiralConfig = getPiralConfig;
//# sourceMappingURL=piral.js.map