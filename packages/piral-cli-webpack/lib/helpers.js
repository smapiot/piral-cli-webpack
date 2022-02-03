"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendConfig = void 0;
const fs_1 = require("fs");
function extendConfig(webPackConfig, otherConfigPath, overrides = {}) {
    if ((0, fs_1.existsSync)(otherConfigPath)) {
        const otherConfig = require(otherConfigPath);
        if (typeof otherConfig === 'function') {
            webPackConfig = otherConfig(webPackConfig);
        }
        else if (typeof otherConfig === 'object') {
            return Object.assign(Object.assign(Object.assign({}, webPackConfig), otherConfig), overrides);
        }
        else {
            console.warn(`Did not recognize the export from "${otherConfigPath}". Skipping.`);
        }
    }
    return Object.assign(Object.assign({}, webPackConfig), overrides);
}
exports.extendConfig = extendConfig;
//# sourceMappingURL=helpers.js.map