const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

const config = {
  // Entry points to the project
  entry: [
    'webpack/hot/dev-server',
    'webpack/hot/only-dev-server',
    path.join(__dirname, '/src/app/app.js'),
  ],
  // Server Configuration options
  devServer: {
    //[Dennis]: if didn't provide, it uses current folder when access to http://host:port/
    contentBase: 'src/www', // Relative directory for base of server

    //[Dennis]: useless config, it looks like only care devtool in main config (not here)
    // devtool: 'eval',

    //[Dennis]: if set flase, will cause full page reload
    hot: true, // Live-reload

    //[Dennis]: can be set by parameter --inline in webpack-dev-server too
    //When enable, access to http://host:port/ will provide hot reload too 
    //(false will just provide content, but no hot reload)
    inline: true, //Enable inline mode Live-reload
    
    port: 3000, // Port Number
    host: 'localhost', // Change to '0.0.0.0' for external facing server
  },
  devtool: 'source-map',//'', 'eval', ..etc See https://webpack.github.io/docs/configuration.html#devtool
  output: {
    path: buildPath, // Path of output file
    filename: 'app.js', // Name of output file
  },
  plugins: [

    // [Dennis]: if comment this, will cause dev-server - '[HMR] Hot Module Replacement' in browser
    // Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),

    // [Dennis]: if comment this, when hot reload it will load the previous no-error version
    // Allows error warnings but does not stop compiling.
    new webpack.NoErrorsPlugin(),

    //[Dennis]: useless plugin in dev, should config devServer.contentBase
    // Transfer www file to in src/www to buildPath
    // new TransferWebpackPlugin([
    //   {from: 'www'},
    // ], path.resolve(__dirname, 'src')),
  ],
  module: {
    loaders: [
      {
        // React-hot loader and
        test: /\.js$/, // All .js files
        loaders: ['react-hot', 'babel-loader'], // react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath],
      },
    ],
  },
};

module.exports = config;
