const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.ts',
    test: './test/test.ts'
  },
  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Lambda IDE',
      template: 'index.html',
      favicon: './src/favicon.ico'
    }),
    new MonacoEditorWebpackPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.ttf$/,
        type: 'asset/resource'
      },
      {
        test: /\.lambda$/,
        type: 'asset/source'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};