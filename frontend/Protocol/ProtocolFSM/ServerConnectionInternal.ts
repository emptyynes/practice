import type { AuthProvider } from '../types'
import type { Event } from './Event'
import { ProtocolFSM } from './ProtocolFSM'
import { ConnectedState } from './state/ConnectedState'
import { EventType } from './EventType'
import { ConnectionContext } from './ConnectionContext'


export class ServerConnectionInternal {
	private readonly fsm: ProtocolFSM
	ctx: ConnectionContext
	
	constructor(authProvider: AuthProvider) {
		this.ctx = new ConnectionContext(authProvider)
		this.fsm = new ProtocolFSM(this.ctx)
	}
	
	connect() {
		this.fsm.emitEvent({ type: EventType.CONNECT })
	}
	
	disconnect() {
		this.fsm.emitEvent({ type: EventType.DISCONNECT })
	}

	// this.fsm.emitEvent({ type: EventType.AUTHENTICATED });

	async send<T>(data: T, method: "get" | "post"): Promise<unknown> {
		return await this.ctx.getWebSocketTransport().send<T>(data, method)
	}

	canSend(): boolean {
		return this.fsm.state instanceof ConnectedState
	}
}