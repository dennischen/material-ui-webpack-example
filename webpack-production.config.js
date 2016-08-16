const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const argv = require('yargs').argv;

console.log('Build path ',buildPath);

//by -- --Xclean
var clean = argv.Xclean;
//by -- --Xminify
var minify = argv.Xminify;
//by -- --XProduction
//for react warn message stripping
var production = argv.Xproduction

console.log('Xclean:', clean, ', Xminify:', minify, ', Xproduction', production);


const config = {
  entry: {
    app : [path.join(__dirname, '/src/app/app.js')],
    appTS : [path.join(__dirname, '/src/app/appTS.tsx')],
    common : [path.join(__dirname, '/src/app/Common.tsx')],
    //[Dennis] this build whole material-ui to one vendor trunk which is large (1.x M when no compressed)
    // 'vendor-material-ui': ['material-ui'],
    'vendor-material-ui': ['material-ui/styles','material-ui/RaisedButton','material-ui/Dialog','material-ui/FlatButton'],
    'vendor-react': ['react', 'react-dom','react-tap-event-plugin'],
  },
  // Render source-map file for final build
  devtool: 'source-map',
  // output config
  output: {
    path: buildPath, // Path of output file
    filename: !minify?'[name].js':'[name].min.js', // Name of output file
  },
  plugins: [
    //[Dennis]: clean build folder (relative to this file)
    clean?new CleanWebpackPlugin(['build'], { dry: false }):undefined,

    // Define production build to allow React to strip out unnecessary checks
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify(production?'production':'development')
      }
    }),
    //Minify the bundle
    minify?new webpack.optimize.UglifyJsPlugin({
      compress: {
        // suppresses warnings, usually from module minification
        warnings: false,
      },
    }):undefined,
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
      names: ['common','vendor-material-ui','vendor-react'],
      minChunks: Infinity
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/, // All .js, .jsx files
        loaders: ['babel-loader'], // react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath],
      },
      {
        test: /\.tsx?$/, // All .ts, .tsx files
        loaders: ['ts-loader'],
        exclude: [nodeModulesPath],
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx']
  }
};

//trim undefined dynamic plugin, e.g. clean, minify
config.plugins = config.plugins.filter(p=>{return p});

module.exports = config;
