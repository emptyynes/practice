import { State } from '../types'
import { Event } from '../Event'
import { EventType } from '../EventType'
import { FSM } from '../types'
import { IdleState } from './IdleState'
import { ReconnectDelayState } from './ReconnectDelayState'
import type { ConnectionContext } from '../ConnectionContext'


export class ConnectedState implements State<ConnectionContext> {
	private readonly fsm: FSM<ConnectionContext>
	private readonly ctx: ConnectionContext
	readonly name = "Connected"
	
	constructor(fsm: FSM<ConnectionContext>, ctx: ConnectionContext) {
		this.fsm = fsm
		this.ctx = ctx
	}

	enter() {
		this.fsm.startEventTimer({
			type: EventType.SEND_PING,
			payload: { time: Date.now() }
		}, 1000)
		this.ctx.getWebSocketTransport().addOnClosedListener(() => {
			this.fsm.emitEvent({
				type: EventType.FAIL, 
				payload: { reason: "socket closed" }
			})
		})
	}

	handle(event: Event) {
		switch (event.type) {
			case EventType.DISCONNECT: {
				this.fsm.setState(new IdleState(this.fsm, this.ctx))
				break
			}
			case EventType.FAIL: {
				console.error(event.payload.reason)
				this.fsm.setState(new ReconnectDelayState(this.fsm, this.ctx))
				break
			}
			case EventType.SEND_PING: {
				this.ctx.getWebSocketTransport().send<string>("ping", "get", 3000)
					.then(success => {
						console.log(`[PING] time between ping: ${(Date.now() - event.payload.time) / 1000}s`)
						this.fsm.emitEvent({ type: EventType.PING_SUCCESS })
					}).catch(failed => {
						console.warn("ping failed")
						this.fsm.emitEvent({
							type: EventType.FAIL,
							payload: { reason: "ping failed" }
						})
					})
				break
			}
			case EventType.PING_SUCCESS: {
				this.fsm.startEventTimer({
					type: EventType.SEND_PING,
					payload: { time: Date.now() }
				}, 1000)
				break
			}
		}
	}

	leave() {
		this.ctx.getWebSocketTransport().disconnect()
	}
}