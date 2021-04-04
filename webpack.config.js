const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './scripts/index.js',
    output: {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, 'public')
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            inject: 'head',
            scriptLoading: 'blocking',
            favicon: "./favicons/favicon 96x96.png"
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg)$/,
                use: ['file-loader']
            }
        ]
    }
}