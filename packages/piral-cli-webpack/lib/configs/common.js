"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.getPlugins = exports.getHmrEntry = exports.getVariables = exports.extensions = void 0;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const utils_1 = require("piral-cli/utils");
const webpack_1 = require("webpack");
const HotModuleServerPlugin_1 = require("./HotModuleServerPlugin");
const SheetPlugin_1 = require("./SheetPlugin");
const piletCss = 'main.css';
function getStyleLoaders(production) {
    if (production) {
        return [MiniCssExtractPlugin.loader];
    }
    else {
        return [require.resolve('style-loader')];
    }
}
exports.extensions = ['.ts', '.tsx', '.js', '.json'];
function getVariables() {
    return Object.keys(process.env).reduce((prev, curr) => {
        prev[curr] = process.env[curr];
        return prev;
    }, {
        DEBUG_PIRAL: '',
        DEBUG_PILET: '',
    });
}
exports.getVariables = getVariables;
function getHmrEntry(hmrPort) {
    return hmrPort ? [`webpack-hot-middleware/client?path=http://localhost:${hmrPort}/__webpack_hmr&reload=true`] : [];
}
exports.getHmrEntry = getHmrEntry;
function getPlugins(plugins, showProgress, production, pilet, hmrPort) {
    const otherPlugins = [
        new MiniCssExtractPlugin({
            filename: pilet ? piletCss : '[name].[hash:6].css',
            chunkFilename: '[id].[hash:6].css',
        }),
    ];
    if (showProgress) {
        otherPlugins.push(new webpack_1.ProgressPlugin((percent, msg) => {
            if (percent !== undefined) {
                (0, utils_1.progress)(`${~~(percent * 100)}% : ${msg}`);
                if (percent === 1) {
                    (0, utils_1.logReset)();
                    (0, utils_1.log)('generalInfo_0000', 'Bundling finished.');
                }
            }
        }));
    }
    if (hmrPort) {
        otherPlugins.push(new webpack_1.HotModuleReplacementPlugin());
        otherPlugins.push(new HotModuleServerPlugin_1.HotModuleServerPlugin(hmrPort));
    }
    if (production) {
        otherPlugins.push(new webpack_1.optimize.OccurrenceOrderPlugin(true));
        if (pilet) {
            const name = process.env.BUILD_PCKG_NAME;
            otherPlugins.push(new SheetPlugin_1.default(piletCss, name));
        }
    }
    return plugins.concat(otherPlugins);
}
exports.getPlugins = getPlugins;
function getRules(production) {
    const styleLoaders = getStyleLoaders(production);
    const nodeModules = /node_modules/;
    const babelLoader = {
        loader: require.resolve('babel-loader'),
        options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
        },
    };
    const tsLoader = {
        loader: require.resolve('ts-loader'),
        options: {
            transpileOnly: true,
        },
    };
    const fileLoader = {
        loader: require.resolve('file-loader'),
        options: {
            esModule: false,
        },
    };
    return [
        {
            test: /\.(png|jpe?g|gif|bmp|avi|mp4|mp3|svg|ogg|webp|woff2?|eot|ttf|wav)$/i,
            use: [fileLoader],
        },
        {
            test: /\.s[ac]ss$/i,
            use: [...styleLoaders, require.resolve('css-loader'), require.resolve('sass-loader')],
        },
        {
            test: /\.css$/i,
            use: [...styleLoaders, require.resolve('css-loader')],
        },
        {
            test: /\.m?jsx?$/i,
            use: [babelLoader],
            exclude: nodeModules,
        },
        {
            test: /\.tsx?$/i,
            use: [babelLoader, tsLoader],
        },
        {
            test: /\.codegen$/i,
            use: [require.resolve('parcel-codegen-loader')],
        },
        {
            test: /\.js$/i,
            use: [require.resolve('source-map-loader')],
            exclude: nodeModules,
            enforce: 'pre',
        },
        {
            parser: {
                system: false,
            },
        },
    ];
}
exports.getRules = getRules;
//# sourceMappingURL=common.js.map