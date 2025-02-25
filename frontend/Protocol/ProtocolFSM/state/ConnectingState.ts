import { State } from '../types'
import { Event } from '../Event'
import { EventType } from '../EventType'
import { FSM } from '../types'
import { WebSocketTransport } from '../../WebSocketTransport'
import { ConnectedState } from './ConnectedState'
import { ReconnectDelayState } from './ReconnectDelayState'
import { AuthentificatingState } from './AuthentificatingState'
import { endpoints } from '../../config'
import type { ConnectionContext } from '../ConnectionContext'


export class ConnectingState implements State<ConnectionContext> {
	private readonly fsm: FSM<ConnectionContext>
	private readonly ctx: ConnectionContext
	readonly name = "Connecting"
	
	constructor(fsm: FSM<ConnectionContext>, ctx: ConnectionContext) {
		this.fsm = fsm
		this.ctx = ctx
	}

	enter() {
		if (!localStorage.accessToken) {
			this.fsm.emitEvent({ type: EventType.NOT_CONNECTED })
			return
		}

		fetch(endpoints.requestWSEndpoint, {
			headers: {
				Authentication: localStorage.accessToken
			}
		}).then(response => {
			if (!response.ok) {
				this.fsm.emitEvent({ type: EventType.NOT_CONNECTED })
				return
			}

			response.text().then((uid: string) => {
				let webSocketTransport = new WebSocketTransport(window.location.host, uid)
				webSocketTransport.connect(() => {
					this.fsm.emitEvent({ type: EventType.CONNECTED })
				})
				this.ctx.setWebSocketTransport(webSocketTransport)
			})
		})
	}

	handle(event: Event) {
		if (event.type === EventType.CONNECTED) {
			this.fsm.setState(new ConnectedState(this.fsm, this.ctx)) 
		} else if (event.type === EventType.NOT_CONNECTED) {
			this.fsm.setState(
				this.ctx.authProvider.isAuthenticated ?
				new ReconnectDelayState(this.fsm, this.ctx) : new AuthentificatingState(this.fsm, this.ctx)
			)
		}
	}
}