const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    open: true, // abre el navegador por defecto
    overlay: true, // muestra errores en pantalla
    port: 3000, // puerto de escucha
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
      '@material-ui/styles': path.resolve(__dirname, 'node_modules', '@material-ui/styles'),
    },
  },
};
