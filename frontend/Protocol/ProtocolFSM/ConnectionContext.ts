import type { AuthProvider } from '../types'
import type { WebSocketTransport } from '../WebSocketTransport'


export class ConnectionContext {
    authProvider: AuthProvider
    private webSocketTransport?: WebSocketTransport

    constructor(authProvider: AuthProvider) {
        this.authProvider = authProvider
    }

    getWebSocketTransport(): WebSocketTransport {
        if (!this.webSocketTransport) {
            throw new Error("webSocketTransport is missed")
        }
        return this.webSocketTransport
    }

    setWebSocketTransport(webSocketTransport: WebSocketTransport) {
        this.webSocketTransport = webSocketTransport
    }
}