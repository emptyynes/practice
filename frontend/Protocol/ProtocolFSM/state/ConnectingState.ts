import { State } from '../types'
import { Event } from '../Event'
import { EventType } from '../EventType'
import { FSM } from '../types'
import { WebSocketTransport } from '../../WebSocketTransport'
import { ConnectedState } from './ConnectedState'
import { ReconnectDelayState } from './ReconnectDelayState'
import { AuthentificatingState } from './AuthentificatingState'
import type { ConnectionContext } from '../ConnectionContext'


export class ConnectingState implements State {
    private readonly fsm: FSM
    private readonly ctx: ConnectionContext
    readonly name = "Connecting"
	
    constructor(fsm: FSM, ctx: ConnectionContext) {
        this.fsm = fsm
        this.ctx = ctx
    }

    enter() {
        fetch("/api/wsendpoint", {
            headers: {
                Authentication: localStorage.accessToken
            }
        }).then(response => {
            if (!response.ok) {
                return this.fsm.emitEvent({ type: EventType.NOT_CONNECTED })
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
            if (this.ctx.authProvider.isAuthenticated) {
                this.fsm.setState(new ReconnectDelayState(this.fsm, this.ctx))
            } else {
                this.fsm.setState(new AuthentificatingState(this.fsm, this.ctx))
            }
        }
    }
}