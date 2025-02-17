import { ProtocolFSM } from './ProtocolFSM';
import type { AuthProvider } from './types';
import { IdleState } from './ProtocolFSM/state/IdleState';

export class ProtocolAPI {
	static readonly retryTimeout = 1000;
	private readonly fsm: ProtocolFSM;
	constructor(authProvider: AuthProvider) {
		this.fsm = new ProtocolFSM(authProvider);
	}

	connect() {
		this.fsm.emitEvent("connect");
	}

get<T>(data: T) {
	let promise = new Promise((resolve, reject) => {
		let interval: NodeJS.Timeout;
		let processGetRequest = async () => {
			console.log("GET")
			try {
				let result = await this.fsm.send<T>(data, "get")
				if (result instanceof Error) throw result;
				clearInterval(interval);
				resolve(result);
			} catch {
				if (this.fsm.state instanceof IdleState) resolve(new Error("connection closed"));
				else interval = setTimeout(processGetRequest, 1000);
			}
			return processGetRequest;
		}
		processGetRequest()
	});
	
	return promise;  
}

	post<T>(data: T) {
		console.log("POST")
		return this.fsm.send<T>(data, "post"); 
	}

	disconnect() {
		this.fsm.emitEvent("disconnect");
	}
}