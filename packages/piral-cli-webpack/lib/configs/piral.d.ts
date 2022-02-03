import * as webpack from 'webpack';
export declare function getPiralConfig(template: string, dist: string, externals: Array<string>, develop?: boolean, sourceMaps?: boolean, contentHash?: boolean, minimize?: boolean, publicPath?: string, hmr?: number, progress?: boolean): Promise<webpack.Configuration>;
