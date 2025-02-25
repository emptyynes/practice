import type { AuthProvider } from './types';
import { EventType } from './ProtocolFSM/EventType';
import { ServerConnectionInternal } from './ProtocolFSM/ServerConnectionInternal';


export class ServerConnection {
	static readonly retryTimeout = 1000;
	connectionInternal: ServerConnectionInternal

	constructor(authProvider: AuthProvider) {
		this.connectionInternal = new ServerConnectionInternal(authProvider);
	}

	connect() {
		this.connectionInternal.connect()
	}

	async get<T>(data: T): Promise<unknown> {
		while (true) {
			console.log("GET") // eslint-disable-line
			try {
				const result = await this.connectionInternal.send<T>(data, "get");
				if (result instanceof Error) {
					throw result;
				} else {
					return result;
				}
			} catch {
				if (!this.connectionInternal.canSend()) {
					throw new Error("connection closed");
				}
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		}
	}

	async post<T>(data: T) {
		console.log("POST") // eslint-disable-line
		if (!this.connectionInternal.canSend()) {
			throw new Error("connection closed");
		}
		return await this.connectionInternal.send<T>(data, "post"); 
	}

	disconnect() {
		this.connectionInternal.disconnect()
	}

	onAuthenticated() {
	}
}