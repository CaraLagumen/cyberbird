const path = require('path'); //PATH IS A NODE MODULE
const HtmlWebpackPlugin = require('html-webpack-plugin'); //ANOTHER NODE MODULE

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './docs'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html', //BUILD
            template: './src/index.html' //DEVELOPMENT
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/, //GET ALL FILES ENDING IN .JS
                exclude: /node_modules/, //IGNORE HUGE FOLDER
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    mode: 'production'
};