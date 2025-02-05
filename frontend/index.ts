export const auth = async (username: string, password: string) => {
	return await fetch(`/api/auth?username=${username}&password=${password}`);
}

interface AuthProvider {
	isAuthentificated: boolean;
	auth: (username: string, password: string) => Promise<Response>;
}

type WebSocketRequest<T> =  {
	id: number;
	payload: T;
}

type WebSocketResponse<T> = {
	id: number;
	payload: T;
}

type RequestMapEntry = [NodeJS.Timeout | number, (value: unknown) => void, number];

export class SimpleAuthProvider implements AuthProvider {
	isAuthentificated: boolean = false

	constructor() {
		fetch('/api/authCheck').then(response => {
			this.isAuthentificated = response.status === 200
		})
	}

	async auth(username: string, password: string) {
		let result = await fetch(`/api/auth?username=${username}&password=${password}`);
		fetch('/api/authCheck').then(response => { this.isAuthentificated = response.status === 200 })
		return result;
	}
}

export class WebSocketTransport {
	socket?: WebSocket
	ready: boolean = false;
	latestRequestId = 0;
	requestsMap = new Map<number, RequestMapEntry>();
	#pingpong?: NodeJS.Timeout

	connect(channelId: string) {
		this.socket = new WebSocket(`ws://localhost:3000/websocket/${channelId}`);
		console.log("WST CONN")
		this.socket.addEventListener("message", (event) => {
			let response: WebSocketResponse<any> = JSON.parse(event.data.toString());

			if (typeof response.payload === "string") {
				let string_data = response.payload as string;
				if (string_data === "pong") {
					let entry = this.requestsMap.get(response.id);
					if (entry) {
						let [timeoutTimer, resolver, _] = entry;
						clearInterval(timeoutTimer);
						this.requestsMap.delete(response.id);
						resolver(response.payload);
					}
				}
			}
		});
		this.#pingpong = setInterval(async () => {
			let pong = await this.send<string>("ping", -1);
			console.log(`PONG: |${pong}|`)
		}, 1000);
		this.ready = true;
	}

	disconnect() {
		this.ready = false;
		this.requestsMap = new Map([...this.requestsMap].filter((x: [number, RequestMapEntry]) => x[1][2] >= 0))
		this.socket!.close();
	}

	send<T>(data: T, retry: number) {
		if (!this.ready) throw new Error("not ready");
		return new Promise((resolve, reject) => {
			let request: WebSocketRequest<T> = {
				id: this.latestRequestId++,
				payload: data
			};
			this.socket!.send(JSON.stringify(request));

			let timeoutTimer = setTimeout(() => {
				this.requestsMap.delete(request.id);
				this.disconnect();
				if (this.#pingpong) {
					clearInterval(this.#pingpong);
					this.#pingpong = undefined;
				}
				console.log(`REQUEST ${request.id} FAILED`)
			}, 1000);

			this.requestsMap.set(request.id, [timeoutTimer, resolve, retry]);
		})
	}

	sendCommand(command: string, data: any) {
		if (!this.ready) throw new Error("not ready");
		if (data) this.socket!.send(`\0${command}\0${JSON.stringify(data)}`)
		else this.socket!.send(`\0${command}`)
	}
}

export class WebSocketConnector {
	wst: WebSocketTransport

	constructor(authProvider: AuthProvider) {
		this.wst = new WebSocketTransport();
	}

	async connect() {
		let uid = await (await fetch("/api/startUpgrade")).text();
		this.wst.connect(uid);
	}

	async get(data: string) {

	}

	async post(data: string) {

	}

	close() {
		this.wst.disconnect();
	}
}

console.log(auth)