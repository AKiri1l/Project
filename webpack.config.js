const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  target: 'web',
  entry: {
  main: './src/index.js',
},
output: {
  path: path.resolve(__dirname, 'dist'),
  filename: 'index.js',
  publicPath: '',
},
mode: 'development',
devServer: {
  static: path.resolve(__dirname, './dist'),
  open: true,
  compress: true,
  port: 3000
},
module: {
  rules: [{
      test: /\.js$/,
      use: 'babel-loader',
      exclude: '/node_modules/'
    },
    {
      test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
      type: 'asset/resource',
    },
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        'postcss-loader'
      ]
    },
  ]
},
resolve: {
  fallback: {
    "path": false,
    "stream": false,
    "util": require.resolve("util/"),
    "child_process": false,
    "fs": false,
    "zlib": require.resolve("browserify-zlib"),
    "querystring": require.resolve("querystring-es3"),
    "crypto": require.resolve("crypto-browserify"),
    "http": require.resolve("stream-http"),
    "assert": require.resolve("assert/"),
    net: false,
    "vm": require.resolve("vm-browserify"),
  }
},
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html'
  }),
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin(),
]
}