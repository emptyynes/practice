"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const app = (0, express_1.default)();
const port = 8080;
app.use(express_1.default.static('../dist'));
app.use("/", (rq, rs) => {
    rs.send("hello");
});
const wss = new ws_1.WebSocketServer({ server: app.listen(port) });
wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.on('message', (message) => {
        console.log('Received:', message.toString());
        ws.send(`Server received: ${message}`);
    });
    ws.on('close', () => console.log('Client disconnected'));
});
console.log(`Server running at http://localhost:${port}`);
