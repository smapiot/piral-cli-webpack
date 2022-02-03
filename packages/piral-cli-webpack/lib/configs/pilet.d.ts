import * as webpack from 'webpack';
import type { PiletSchemaVersion, SharedDependency } from 'piral-cli';
export declare function getPiletConfig(template: string, dist: string, filename: string, externals: Array<string>, importmap: Array<SharedDependency>, piral: string, schema: PiletSchemaVersion, develop?: boolean, sourceMaps?: boolean, contentHash?: boolean, minimize?: boolean, publicPath?: string, progress?: boolean): Promise<webpack.Configuration>;
