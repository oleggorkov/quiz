const webpack =  require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const fs = require('fs');

// Pages const for HtmlWebpackPlugin
const PAGES_DIR = `${baseWebpackConfig.externals.paths.src}/views/pages`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));

const devWebpackConfig = merge(baseWebpackConfig, {
  // DEV config
  mode: 'development',
  output: {
    publicPath: '/'
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: `${baseWebpackConfig.externals.paths.dist}/html`,
    port: 8081,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loader: {
            scss: 'vue-style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false,
            }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true, }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    }),
    new webpack.ProgressPlugin((percentage, message) => {
      console.log(`${(percentage * 100).toFixed()}% ${message}`);
    }),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      { from: `${baseWebpackConfig.externals.paths.src}/img`, to: `${baseWebpackConfig.externals.paths.assets}img` },
      //{ from: `${baseWebpackConfig.externals.paths.src}/fonts`, to: `${baseWebpackConfig.externals.paths.assets}fonts` },
      { from: `${baseWebpackConfig.externals.paths.src}/static`, to: `${baseWebpackConfig.externals.paths.assets}static`}
    ]),
    new SVGSpritemapPlugin(`${baseWebpackConfig.externals.paths.src}/img/sprite-icons/*.svg`,{
      output: {
        filename: 'img/sprite.svg',
      }
    }),

    ...PAGES.map(page => new HtmlWebpackPlugin({
      cache: true,
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.pug/,'.html')}`
    })),
  ]
});

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig)
});
