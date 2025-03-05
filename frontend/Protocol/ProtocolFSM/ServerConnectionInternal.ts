import type { AuthProvider } from '../types'
import { ProtocolFSM } from './ProtocolFSM'
import { ConnectedState } from './state/ConnectedState'
import { EventType } from './EventType'
import { ConnectionContext } from './ConnectionContext'


export class ServerConnectionInternal {
    private readonly fsm: ProtocolFSM
    private readonly ctx: ConnectionContext
    isOpen: boolean = false
	
    constructor(authProvider: AuthProvider) {
        this.ctx = new ConnectionContext(authProvider)
        this.fsm = new ProtocolFSM(this.ctx)
    }
	
    connect() {
        this.isOpen = true
        this.fsm.emitEvent({ type: EventType.CONNECT })
    }
	
    disconnect() {
        this.isOpen = false
        this.fsm.emitEvent({ type: EventType.DISCONNECT })
    }

    async send<T>(data: T, method: "get" | "post"): Promise<unknown> {
        return await this.ctx.getWebSocketTransport().send<T>(data, method)
    }

    canSend(): boolean {
        return this.fsm.state instanceof ConnectedState
    }
}