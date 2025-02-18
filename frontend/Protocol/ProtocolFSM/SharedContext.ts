import type { AuthProvider } from '../types';
import type { WebSocketTransport } from '../WebSocketTransport';


export class SharedContext {
	authProvider: AuthProvider;
	webSocketTransport?: WebSocketTransport;

	constructor(authProvider: AuthProvider) {
		this.authProvider = authProvider;
	}
}