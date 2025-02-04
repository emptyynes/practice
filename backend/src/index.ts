import express from 'express';
import cookie from 'cookie';
import { WebSocketServer } from 'ws';

const app = express();
const port = 8081;

const webSocketServer = new WebSocketServer({ noServer: true, path: '/websocket' });

webSocketServer.on('connection', function connection(webSocket) {
  // console.log("!!!")
  webSocket.on('error', console.error);

  webSocket.on('message', function message(data: any) {
    if (data.length > 0 && data[0] === 0) {
      data = data.toString().split('\0');
      if (data.length > 2)
        console.log(`command ${data[1]} with data ${data[2]}`)
      else
        console.log(`command ${data[1]}`)
    } else
      console.log(`received: ${data}`, data.length);
  });

  // webSocket.send('hello');
});

app.get('/api/auth', function (request, response) {
  if (request.query.username && request.query.password) {
    const options = {
      secure: true,
      httpOnly: true,
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000
    };

    response.cookie("username", request.query.username, options);
    response.cookie("password", request.query.password, options);

    response.send("authenficated");
  }
});

const server = app.listen(port);

server.on('upgrade', (request, socket, head) => {
  // let cookies = cookie.parse(request.headers.cookie || "");
  // if (cookies.username && cookies.password)
    webSocketServer.handleUpgrade(request, socket, head, socket => {
      webSocketServer.emit('connection', socket, request);
    });
});

// server.on('upgrade', (request, socket, head) => {
//   webSocketServer.handleUpgrade(request, socket, head, socket => {
//     webSocketServer.emit('connection', socket, request);
//   });
// });