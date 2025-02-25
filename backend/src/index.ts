import express from 'express'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { WebSocketServer } from 'ws'
import authRouter from './auth'
import handler from './protocol'

const app = express()
const port = 8080

const webSocketServer = new WebSocketServer({ noServer: true })

let endpoints = new Map<string, boolean>()

webSocketServer.on('connection', function connection(webSocket) {
    let isAlive: boolean = true
    let keepaliveCode: number = 0

    console.log("new connection")

    webSocket.on('error', console.error)

    webSocket.on('message', (data) => {
        handler(webSocket, data) 
    })
})

app.get('/api/wsendpoint', (request, response) => {
    if (!request.headers.authentication) {
        return response.status(401).send("Unauthorized")
    }
    jwt.verify(request.headers.authentication.toString() || "", "secret1234", (error, decoded) => {
        if (error) {
            response.status(401).send("Unauthorized")
        } else {
            let uid = `${Math.floor(Math.random() * 1e10)}`
            endpoints.set(uid, true)
            response.send(uid)
            setTimeout(() => {
                endpoints.delete(uid)
            }, 10 * 1000) // endpoint is alive for 10 seconds
        }
    })
})

const server = app.listen(port)

server.on('upgrade', (request, socket, head) => {
    let uid = request.url!.substring("/websocket/".length)
    if (!endpoints.get(uid)) {
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
        socket.destroy()
        return
    }

    webSocketServer.handleUpgrade(request, socket, head, (socket) => {
        webSocketServer.emit('connection', socket, request)
    })
})

app.use('/api/auth', authRouter)