const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: './src/client/index.js',
    mode: 'development',
    devtool: 'source-map',
    stats: 'verbose',
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', {
                    loader: 'sass-loader',
                    options: {
                      implementation: require('sass'),
                    }
                  }]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new CleanWebpackPlugin({
            // Simulate the removal of files
            dry: true,
            // Write Logs to Console
            verbose: true,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        }),
        new CopyWebpackPlugin(
            { 
                patterns: [
                    {from:'src/client/images',to:'images'}
                ]
              }
        ),
        new MiniCssExtractPlugin({filename: '[name].css'}),
    ]
}