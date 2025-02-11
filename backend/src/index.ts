import express from 'express';
import cookie from 'cookie';
import { WebSocketServer } from 'ws';

const app = express();
const port = 8080;

const webSocketServer = new WebSocketServer({ noServer: true });

let endpoints = new Map<string, boolean>();

type WebSocketRequest<T> =  {
  id: number;
  payload: T;
}

type WebSocketResponse<T> = {
  id: number;
  payload: T;
}

webSocketServer.on('connection', function connection(webSocket) {
  let isAlive: boolean = true;
  let keepaliveCode: number = 0;

  console.log("new connection")

  webSocket.on('error', console.error);

  webSocket.on('message', function message(data_object) {
    let data: WebSocketRequest<any> = JSON.parse(data_object.toString());
    console.log(`received ${data.payload} with id ${data.id}`)
    if (typeof data.payload === "string") {
      let string_data: string = data.payload as string;
      if (data.payload === "ping") {
        let response: WebSocketResponse<string> = {
          id: data.id,
          payload: "pong"
        };
        setTimeout(() => {
          webSocket.send(JSON.stringify(response));
        }, 500);
      }
    }
    else console.log("idk")
    return;
  });
});

app.get('/api/auth', (request, response) => {
  if (request.query.username && request.query.password) {
    const options = {
      secure: true,
      httpOnly: true,
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000 // 6 months
    };

    response.cookie("username", request.query.username, options);
    response.cookie("password", request.query.password, options);

    response.send("authenficated");
  }
});

app.get('/api/authCheck', (request, response) => {
  let cookies = cookie.parse(request.headers.cookie || "");
  if (cookies.username && cookies.password)
    response.status(200).send("Authorized");
  else
    response.status(401).send("Unauthorized");
});

app.get('/api/startUpgrade', (request, response) => {
  let cookies = cookie.parse(request.headers.cookie || "");
  if (!(cookies.username && cookies.password)) {
    response.status(401).send("Unauthorized");
    return;
  }

  let uid = `${Math.floor(Math.random() * 1e10)}`;
  endpoints.set(uid, true);
  response.send(uid);
  setTimeout(() => {
    endpoints.delete(uid);
  }, 10 * 1000) // endpoint is alive for 10 seconds
})

const server = app.listen(port);

server.on('upgrade', (request, socket, head) => {
  let cookies = cookie.parse(request.headers.cookie || "");
  if (!(cookies.username && cookies.password)) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  let uid = request.url!.substring("/websocket/".length);
  if (!endpoints.get(uid)) {
    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
    socket.destroy();
    return;
  }

  webSocketServer.handleUpgrade(request, socket, head, (socket) => {
    webSocketServer.emit('connection', socket, request);
  });
});

// server.on('upgrade', (request, socket, head) => {
//   webSocketServer.handleUpgrade(request, socket, head, socket => {
//     webSocketServer.emit('connection', socket, request);
//   });
// });