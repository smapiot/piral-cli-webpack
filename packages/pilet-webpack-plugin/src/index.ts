import { Plugin, Compiler, BannerPlugin, DefinePlugin } from 'webpack';
import {
  setEnvironment,
  getDefineVariables,
  getVariables,
  withExternals,
  getDependencies,
} from './helpers';
import { PiletWebpackPluginOptions } from './types';

const pluginName = 'PiletWebpackPlugin';

export class PiletWebpackPlugin implements Plugin {
  private variables: Record<string, string>;
  private externals: Array<string>;

  constructor(private options: PiletWebpackPluginOptions) {}

  piletVxWebpackConfigEnhancer(compiler: Compiler) {
    const config = compiler.options;

    setEnvironment(this.variables);
    withExternals(config, this.externals);

    const plugins = [new DefinePlugin(getDefineVariables(this.variables))];
    compiler.hooks.afterEnvironment.tap(pluginName, () => {});
    return plugins;
  }

  piletV0WebpackConfigEnhancer(compiler: Compiler) {
    const { name } = this.options;
    const config = compiler.options;
    const shortName = name.replace(/\W/gi, '');
    const prName = `wp4Chunkpr_${shortName}`;
    const [mainEntry] = Object.keys(config.entry);
    const banner = `//@pilet v:0`;

    setEnvironment(this.variables);
    withExternals(config, this.externals);

    const plugins = [
      new DefinePlugin(getDefineVariables(this.variables)),
      new BannerPlugin({
        banner(data) {
          const { chunk } = data;
          return chunk.name === mainEntry ? banner : '';
        },
        entryOnly: true,
        raw: true,
      } as any),
    ];

    compiler.hooks.afterEnvironment.tap(pluginName, () => {
      config.output.jsonpFunction = `${prName}`;
      config.output.library = name;
      config.output.libraryTarget = 'umd';
    });

    return plugins;
  }

  piletV1WebpackConfigEnhancer(compiler: Compiler) {
    const { name } = this.options;
    const config = compiler.options;
    const shortName = name.replace(/\W/gi, '');
    const prName = `wp4Chunkpr_${shortName}`;
    const [mainEntry] = Object.keys(config.entry);
    const banner = `//@pilet v:1(${prName})`;

    setEnvironment(this.variables);
    withExternals(config, this.externals);

    const plugins = [
      new DefinePlugin(getDefineVariables(this.variables)),
      new BannerPlugin({
        banner(data) {
          const { chunk } = data;
          return chunk.name === mainEntry ? banner : '';
        },
        entryOnly: true,
        raw: true,
      } as any),
    ];

    compiler.hooks.afterEnvironment.tap(pluginName, () => {
      config.output.jsonpFunction = `${prName}`;
      config.output.library = name;
      config.output.libraryTarget = 'umd';
      config.output.auxiliaryComment = {
        commonjs2: `\nfunction define(d,k){if(typeof document!=='undefined'){var _r=${prName};delete ${prName};document.currentScript.app=k.apply(null,d.map(_r))}}define.amd=!0;`,
      } as any;
    });

    return plugins;
  }

  piletV2WebpackConfigEnhancer(compiler: Compiler) {
    const { name, importmap } = this.options;
    const config = compiler.options;
    const shortName = name.replace(/\W/gi, '');
    const prName = `wp4Chunkpr_${shortName}`;
    const [mainEntry] = Object.keys(config.entry);

    withExternals(config, this.externals);
    setEnvironment(this.variables);

    const dependencies = getDependencies(importmap, config);
    const banner = `//@pilet v:2(${prName},${JSON.stringify(dependencies)})`;

    const plugins = [
      new DefinePlugin(getDefineVariables(this.variables)),
      new BannerPlugin({
        banner(data) {
          const { chunk } = data;
          return chunk.name === mainEntry ? banner : '';
        },
        entryOnly: true,
        raw: true,
      } as any),
    ];

    compiler.hooks.afterEnvironment.tap(pluginName, () => {
      config.module.rules.push({ parser: { system: false } });
      config.output.jsonpFunction = `${prName}`;
      config.output.libraryTarget = 'system';
    });

    return plugins;
  }

  piletV3WebpackConfigEnhancer(compiler: Compiler) {
    // right now this is just an alias for V2
    return this.piletV2WebpackConfigEnhancer(compiler);
  }

  setup(compiler: Compiler) {
    const { name, version, externals = [], schema } = this.options;
    const environment = process.env.NODE_ENV || 'development';
    this.variables = {
      ...getVariables(name, version, environment),
      ...this.options.variables,
    };
    this.externals = externals;

    switch (schema) {
      case 'v0':
        return this.piletV0WebpackConfigEnhancer(compiler);
      case 'v1':
        return this.piletV1WebpackConfigEnhancer(compiler);
      case 'v2':
        return this.piletV2WebpackConfigEnhancer(compiler);
      case 'v3':
        return this.piletV3WebpackConfigEnhancer(compiler);
      case 'none':
      default:
        return this.piletVxWebpackConfigEnhancer(compiler);
    }
  }

  apply(compiler: Compiler) {
    const plugins = this.setup(compiler);
    plugins.forEach(plugin => plugin.apply(compiler));
  }
}
