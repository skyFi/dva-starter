import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { join } from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';

export default {

  devtool: '#source-map',

  entry: {
    index: './client/index.js',
  },

  output: {
    filename: '[name].js',
    path: join(__dirname, './public'),
    publicPath: '/',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract(
          'css-loader?sourceMap&modules&localIdentName=[local]___[hash:base64:5]'
        ),
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader',
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: ExtractTextPlugin.extract(
          'css-loader?sourceMap'
        ),
      },
    ]
  },

  postcss: [autoprefixer()],

  plugins: [
    new ExtractTextPlugin('./[name].css', {
      disable: false,
      allChunks: true,
    }),
    // new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new webpack.DefinePlugin({
      // 'process.env.NODE_ENV': '"production"'
    }),
  ],
};