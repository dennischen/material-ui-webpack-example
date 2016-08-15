const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

console.log('Build path ',buildPath);

const config = {
  entry: {
    app : [path.join(__dirname, '/src/app/app.js')],
    //[Dennis] this build whole material-ui to one vendor trunk which is large (1.xM when no compress)
    // 'vendor-material-ui': ['material-ui'],
    'vendor-material-ui': ['material-ui/styles','material-ui/RaisedButton','material-ui/Dialog','material-ui/FlatButton'],
    'vendor-react': ['react', 'react-dom','react-tap-event-plugin'],
  },
  // Render source-map file for final build
  devtool: 'source-map',
  // output config
  output: {
    path: buildPath, // Path of output file
    filename: '[name].js', // Name of output file
  },
  plugins: [
    //[Dennis]: clean build folder (relative to this file)
    new CleanWebpackPlugin(['build'], { dry: false }),

    // Define production build to allow React to strip out unnecessary checks
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // Minify the bundle
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     // suppresses warnings, usually from module minification
    //     warnings: false,
    //   },
    // }),
    //[Dennis]: this didn't work in production, js error always stop the build and output nothing
    // Allows error warnings but does not stop compiling.
    // new webpack.NoErrorsPlugin(),
    
    // Transfer www file to in src/www to buildPath
    new TransferWebpackPlugin([
      {from: 'www'},
    ], path.resolve(__dirname, 'src')),

    //[Dennis] vendor code split, 
    //the last name will has the core 'webpackJsonp' mehtod which must be put to first script in html file
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor-material-ui','vendor-react'],
      minChunks: Infinity
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/, // All .js files
        loaders: ['babel-loader'], // react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath],
      },
    ],
  },
};

module.exports = config;
