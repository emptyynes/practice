import { State } from '../types'
import { Event } from '../Event'
import { EventType } from '../EventType'
import { FSM } from '../types'
import { ConnectingState } from './ConnectingState'
import type { ConnectionContext } from '../ConnectionContext'


export class AuthentificatingState implements State<ConnectionContext> {
	private readonly fsm: FSM<ConnectionContext>
	private readonly ctx: ConnectionContext
	readonly name = "Authentificating"

	constructor(fsm: FSM<ConnectionContext>, ctx: ConnectionContext) {
		this.fsm = fsm
		this.ctx = ctx
	}

	enter() {
		this.ctx.authProvider.auth()
			.then(() => {
				this.fsm.emitEvent({ type: EventType.AUTHENTICATED })
			})
			.catch(() => {
				console.warn("auth failure")
			})
	}

	handle(event: Event) {
		if (event.type === EventType.AUTHENTICATED) {
			this.fsm.setState(new ConnectingState(this.fsm, this.ctx))
		}
	}
}