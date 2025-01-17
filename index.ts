import express from 'express';
import cookie from 'cookie';
import { readFileSync } from 'fs';
import { WebSocketServer } from 'ws';


const app = express();

const webSocketServer = new WebSocketServer({ noServer: true });

webSocketServer.on('connection', function connection(webSocket) {
	webSocket.on('error', console.error);

	webSocket.on('message', function message(data) {
		if (data.length > 0 && data[0] === 0) {
			data = data.toString().split('\0');
			if (data.length > 2)
				console.log(`command ${data[1]} with data ${data[2]}`)
			else
				console.log(`command ${data[1]}`)
		} else
			console.log(`received: ${data}`, data.length);
	});

	webSocket.send('hello');
});


app.get('/', function (req, res) {
	const fileName = `${__dirname}/index.html`;
	res.sendFile(fileName, null, function (err) {
		if (err) console.error('Error sending file:', err);
	});
});

app.get('/auth', function (req, res) {
	if (req.query.username && req.query.password) {
		const options = {
			secure: true,
			httpOnly: true,
			maxAge: 6 * 30 * 24 * 60 * 60 * 1000
		};

		res.cookie("username", req.query.username, options);
		res.cookie("password", req.query.password, options);

		res.send("authenficated");
	}
});

const server = app.listen(80);
server.on('upgrade', (request, socket, head) => {
	let cookies = cookie.parse(request.headers.cookie || "");
	if (cookies.username && cookies.password)
		webSocketServer.handleUpgrade(request, socket, head, socket => {
			webSocketServer.emit('connection', socket, request);
		});
});