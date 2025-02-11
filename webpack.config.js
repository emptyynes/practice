const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './frontend/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		clean: true,
		libraryTarget: 'var',
		library: "bundle",
		// type: "global"
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './frontend/index.html',
			favicon: './frontend/favicon.ico',
			inject: false
		}),
		new MiniCssExtractPlugin({
			filename: 'styles.[contenthash].css'
		})
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader']
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	devServer: {
	    static: {
			directory: path.join(__dirname, 'dist'),
		},
		client: {
			reconnect: true
		},
		port: 3000,
		proxy: [
			{
				context: [ "/api/**" ],
				target: 'http://localhost:8080',
				changeOrigin: true,
				secure: false,
				ws: true,
			},
			{
				context: [ "/websocket/**" ],
				target: 'ws://localhost:8080',
				changeOrigin: true,
				secure: false,
				ws: true,
			}
		]
	}
};