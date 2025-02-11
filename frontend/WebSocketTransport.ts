import type { WebSocketResponse, WebSocketRequest } from './types.ts';

export class WebSocketTransport {
	socket: WebSocket
	latestRequestId = 0;
	requestsMap = new Map<number, (value: unknown) => void>();


	constructor(channelId: string) {
		this.socket = new WebSocket(`ws://localhost:3000/websocket/${channelId}`);

		this.socket.addEventListener("message", (event) => {
			let response: WebSocketResponse<any> = JSON.parse(event.data.toString());

			if (typeof response.payload === "string") {
				let string_data = response.payload as string;
				if (string_data === "pong") {
					let resolver = this.requestsMap.get(response.id);
					if (resolver) {
						this.requestsMap.delete(response.id);
						resolver(response.payload);
					}
				}
			}
		});
	}

	disconnect() {
		this.socket!.close();
	}

	send<T>(data: T, retry: number) {
		return new Promise((resolve, reject) => {
			let request: WebSocketRequest<T> = {
				id: this.latestRequestId++,
				payload: data
			};
			this.socket!.send(JSON.stringify(request));

			this.requestsMap.set(request.id, resolve);
		})
	}
}