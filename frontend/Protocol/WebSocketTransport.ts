import type { WebSocketResponse, WebSocketRequest } from './types.ts'
import { endpoints } from './config'


export class WebSocketTransport {
	private connected: boolean = true
	socket: WebSocket
	latestRequestId = 0
	requestsMap = new Map<number, [(value: unknown) => void, ReturnType<typeof setTimeout>]>()

	private socketCloseEventHandler?: () => void
	private socketMessageEventHandler = (event: MessageEvent) => {
		let response: WebSocketResponse<any> = JSON.parse(event.data.toString())

		let entry = this.requestsMap.get(response.id)
		if (entry) {
			let [ resolver, timeout ] = entry
			clearInterval(timeout)
			this.requestsMap.delete(response.id)
			resolver(response.payload)
		}
	}

	addOnClosedListener(listener: () => void) {
		this.socketCloseEventHandler = listener
		this.socket.addEventListener("close", this.socketCloseEventHandler)
	}

	constructor(host: string, channelId: string) {
		this.socket = new WebSocket(`ws://${host}${endpoints.ws}/${channelId}`)
		
		this.socket.addEventListener("message", this.socketMessageEventHandler)
	}

	connect(callback: () => void) {
		this.socket.addEventListener("open", (_) => {
			this.connected = true
			callback()
		})
	}

	disconnect() {
		this.connected = false

		if (this.socketCloseEventHandler) {
			this.socket.removeEventListener("close", this.socketCloseEventHandler)
		}
		this.socket.removeEventListener("message", this.socketMessageEventHandler)
		
		if (this.socket.readyState === WebSocket.OPEN) {
			this.socket.close()
		} else if (this.socket.readyState === WebSocket.CONNECTING) {
			this.socket.addEventListener("open", (_) => {
				this.socket.close()
			})
		}
	}

	send<T>(data: T, method: "get" | "post", timeout?: number) {
		if (!this.connected) {
			throw new Error("WebSocketTransport was disconnected")
		}
		if (this.socket.readyState !== WebSocket.OPEN) {
			throw new Error("WebSocket is not open")
		}
		return new Promise((resolve, reject) => {
			let request: WebSocketRequest<T> = {
				id: this.latestRequestId++,
				method: method,
				payload: data
			}
			this.socket.send(JSON.stringify(request))


			timeout = timeout ?? 3000

			let timer = setTimeout(() => {
				this.requestsMap.delete(request.id)
				if (this.connected) {
					reject(new Error(`timeout ${data}`))
				} else {
					resolve(undefined)
				}
			}, timeout)
			
			this.requestsMap.set(request.id, [ resolve, timer ])
		})
	}
}