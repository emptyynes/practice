import type { WebSocketRequest, WebSocketResponse } from './types'
import type { WebSocket, RawData } from 'ws'

export default function handler(webSocket: WebSocket, data_object: RawData) {
    const data: WebSocketRequest<any> = JSON.parse(data_object.toString())
    console.log(`received/${data.method} ${data.payload} with id ${data.id}`)
    if (typeof data.payload === "string") {
        if (data.payload === "ping") {
            const response: WebSocketResponse<string> = {
                id: data.id,
                payload: "pong"
            }
            setTimeout(() => {
                webSocket.send(JSON.stringify(response))
            }, 500)
        } else if (data.payload === "testget" && data.method === "get") {
            const response: WebSocketResponse<string> = {
                id: data.id,
                payload: "successful get!"
            }
            setTimeout(() => {
                webSocket.send(JSON.stringify(response))
            }, 1500)
        } else if (data.payload === "testpost" && data.method === "post") {
            const response: WebSocketResponse<string> = {
                id: data.id,
                payload: "successful post!"
            }
            setTimeout(() => {
                webSocket.send(JSON.stringify(response))
            }, 1500)
        }
    } else {
        console.warn("unknown data")
    }
}