const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const fs = require('fs');

// Pages const for HtmlWebpackPlugin
const PAGES_DIR = `${baseWebpackConfig.externals.paths.src}/views/pages`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));

const buildWebpackConfig = merge(baseWebpackConfig, {
    // BUILD config
    mode: 'production',
    output: {
        publicPath: ''
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true
                }
            }
        },
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
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
                options: {
                    pretty: true,
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            url: false,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: { sourceMap: true, config: { path: `./postcss.config.js` } }
                    }, {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true }
                    }, {
                        loader: 'postcss-loader',
                        options: { sourceMap: true, config: { path: `./postcss.config.js` } }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            //filename: `${baseWebpackConfig.externals.paths.assets}styles/[name].[hash].css`,
            filename: `${baseWebpackConfig.externals.paths.assets}styles/[name].css`,
        }),
        new webpack.ProgressPlugin((percentage, message) => {
            console.log(`${(percentage * 100).toFixed()}% ${message}`);
        }),
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
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
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page.replace(/\.pug/,'.html')}`
        })),
    ],
});

module.exports = new Promise((resolve, reject) => {
    resolve(buildWebpackConfig)
});
