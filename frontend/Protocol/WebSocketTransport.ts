import type { WebSocketResponse, WebSocketRequest } from './types.ts';
import { endpoints } from './config';

export class WebSocketTransport {
	socket: WebSocket;
	latestRequestId = 0;
	requestsMap = new Map<number, (value: unknown) => void>();

	constructor(host: string, channelId: string) {
		this.socket = new WebSocket(`ws://${host}${endpoints.ws}/${channelId}`);

		this.socket.addEventListener("message", (event) => {
			let response: WebSocketResponse<any> = JSON.parse(event.data.toString());

			let resolver = this.requestsMap.get(response.id);
			if (resolver) {
				this.requestsMap.delete(response.id);
				resolver(response.payload);
			}
		});
	}

	disconnect() {
		if (this.socket.readyState === WebSocket.OPEN)
			this.socket.close();
		else if (this.socket.readyState === WebSocket.CONNECTING) {
			this.socket.addEventListener("open", (_) => {
				this.socket.close();
			});
		}
	}

	send<T>(data: T, method: "get" | "post") {
		if (this.socket.readyState !== WebSocket.OPEN) throw new Error("WebSocket is not open");
		return new Promise((resolve, reject) => {
			let request: WebSocketRequest<T> = {
				id: this.latestRequestId++,
				method: method,
				payload: data
			};
			this.socket.send(JSON.stringify(request));

			this.requestsMap.set(request.id, resolve);

			setTimeout(() => {
				this.requestsMap.delete(request.id);
				resolve(new Error("timeout"));
			}, 3000);
		});
	}
}