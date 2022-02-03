import { RuleSetRule } from 'webpack';
export declare const extensions: string[];
export declare function getVariables(): Record<string, string>;
export declare function getHmrEntry(hmrPort: number): string[];
export declare function getPlugins(plugins: Array<any>, showProgress: boolean, production: boolean, pilet: boolean, hmrPort?: number): any[];
export declare function getRules(production: boolean): Array<RuleSetRule>;
