const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const slsw = require('serverless-webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  context: __dirname,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: slsw.lib.webpack.isLocal
    ? 'eval-cheap-module-source-map'
    : 'source-map',
  resolve: {
    extensions: ['.json', '.js', '.ts'],
    symlinks: false,
    cacheWithContext: false,
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.paths.json',
      }),
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  optimization: {
    concatenateModules: false,
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'src'),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      ...slsw.lib.serverless.service.provider.environment,
      'process.env.STAGE': JSON.stringify(slsw.lib.options.stage),
      __DEV__: slsw.lib.webpack.isLocal,
    }),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        enabled: true,
        files: './**/*.{js,ts}',
        options: { cache: true },
      },
    }),
  ],
}
