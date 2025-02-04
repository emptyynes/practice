const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './frontend/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.[contenthash].js',
		clean: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './frontend/index.html'
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
			}
		]
	},
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		compress: true,
		port: 3000,
		proxy: [
			{
				context: '/api',
				target: 'http://localhost:8080',
				changeOrigin: true,
				ws: false
			},
			// {
			// 	context: '/ws',
			// 	target: 'ws://localhost:8080',
			// 	ws: true
			// }
		]
	}
};