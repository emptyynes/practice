const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './frontend/index.ts',
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
			// {
			// 	context: '/api',
			// 	target: 'http://localhost:8080',
			// 	changeOrigin: true,
			// 	ws: false,
			// 	onProxyReq: (proxyReq, req, res) => {
			// 		console.debug("TEST111 onProxyReq", proxyReq, req, res)
			// 	},
			// },
			{
				context: '/websocket',
				target: 'ws://localhost:8081',
				changeOrigin: true,
				secure: false,
				ws: true,
			}
		]
	}
	// devServer: {
	// 	static: {
	// 		directory: path.join(__dirname, 'dist'),
	// 	},
	// 	host: "0.0.0.0",
	// 	port: 3000,
	// 	client: {
	// 		webSocketURL: "ws://localhost:8080",
	// 		webSocketTransport: 'ws',
	// 		reconnect: false,
	// 	},
	// 	webSocketServer: 'ws',
	// 	allowedHosts: "all",
	// },
};