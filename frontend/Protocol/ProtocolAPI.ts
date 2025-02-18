import { FSMProtocolAPI } from './ProtocolFSM/types';
import { ProtocolFSM } from './ProtocolFSM/ProtocolFSM';
import type { AuthProvider } from './types';
import { IdleState } from './ProtocolFSM/state/IdleState';
import { EventType } from './ProtocolFSM/EventType';


export class ProtocolAPI {
	static readonly retryTimeout = 1000;
	private readonly fsm: FSMProtocolAPI;
	constructor(authProvider: AuthProvider) {
		this.fsm = new ProtocolFSM(authProvider);
	}

	connect() {
		this.fsm.emitEvent(EventType.CONNECT);
	}

	async get<T>(data: T): Promise<unknown> {
		while (true) {
			console.log("GET") // eslint-disable-line
			try {
				const result = await this.fsm.send<T>(data, "get");
				if (result instanceof Error) throw result;
				return result;
			} catch {
				if (this.fsm.state instanceof IdleState)
					throw new Error("connection closed");
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		}
	}

	async post<T>(data: T) {
		console.log("POST") // eslint-disable-line
		return await this.fsm.send<T>(data, "post"); 
	}

	disconnect() {
		this.fsm.emitEvent(EventType.DISCONNECT);
	}

	onAuthentificated() {
		this.fsm.emitEvent(EventType.AUTHENTIFICATED);
	}
}