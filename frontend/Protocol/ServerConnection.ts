import type { AuthProvider } from './types'
import { EventType } from './ProtocolFSM/EventType'
import { ServerConnectionInternal } from './ProtocolFSM/ServerConnectionInternal'


export class ServerConnection {
    connectionInternal: ServerConnectionInternal

    constructor(authProvider: AuthProvider) {
        this.connectionInternal = new ServerConnectionInternal(authProvider)
    }

    connect() {
        this.connectionInternal.connect()
    }

    async get<T>(data: T): Promise<unknown> {
        let retryTimeouts = [1000, 3000, 6000];
        let retryIndex = -1;
        while (true) {
            console.log("[SRV CONN] GET")
            try {
                const result = await this.connectionInternal.send<T>(data, "get")
                if (result instanceof Error) {
                    throw result
                } else {
                    return result
                }
            } catch {
                console.warn("[SRV CONN] CANNOT GET")
                if (!this.connectionInternal.isOpen) {
                    throw new Error("connection closed")
                }
                if ((++retryIndex) === retryTimeouts.length) retryIndex--;
                console.log(`[SRV CONN] waiting ${retryTimeouts[retryIndex] / 1000}s`)
                await new Promise(resolve => setTimeout(resolve, retryTimeouts[retryIndex]))
            }
        }
    }

    async post<T>(data: T) {
        console.log("POST")  
        if (!this.connectionInternal.canSend()) {
            throw new Error("connection closed")
        }
        return await this.connectionInternal.send<T>(data, "post") 
    }

    disconnect() {
        this.connectionInternal.disconnect()
    }

    onAuthenticated() {
    }
}