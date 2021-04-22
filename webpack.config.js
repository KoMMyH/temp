const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        sourceMapFilename: "[name].js.map",
        clean: true,
    },
    mode: "development",
    plugins: [
        new HtmlWebpackPlugin({
            template: "public/index.html"
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.(js?x|ts?x)$/,
                enforce: "pre",
                use: ["source-map-loader"],
            },
        ]
    },
    optimization: {
        minimize: true
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: "eval-cheap-source-map",
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        port: 3000
    }
};