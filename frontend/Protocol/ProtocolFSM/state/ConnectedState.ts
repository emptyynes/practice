import { State } from '../types'
import { Event, SendPingEvent } from '../Event'
import { EventType } from '../EventType'
import { FSM } from '../types'
import { IdleState } from './IdleState'
import { ReconnectDelayState } from './ReconnectDelayState'
import type { ConnectionContext } from '../ConnectionContext'


export class ConnectedState implements State {
    private readonly fsm: FSM
    private readonly ctx: ConnectionContext
    readonly name = "Connected"
	
    constructor(fsm: FSM, ctx: ConnectionContext) {
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

    private ping(event: SendPingEvent) {
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
    }

    handle(event: Event) {
        if (event.type === EventType.DISCONNECT) {
            this.fsm.setState(new IdleState(this.fsm, this.ctx))
        } else if (event.type === EventType.FAIL) {
            console.error(event.payload.reason)
            this.fsm.setState(new ReconnectDelayState(this.fsm, this.ctx))
        } else if (event.type === EventType.PING_SUCCESS) {
            this.fsm.startEventTimer({
                type: EventType.SEND_PING,
                payload: { time: Date.now() }
            }, 1000)
        } else if (event.type === EventType.SEND_PING) {
            this.ping(event)
        }
    }

    leave() {
        this.ctx.getWebSocketTransport().disconnect()
    }
}