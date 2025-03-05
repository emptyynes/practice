import { State } from '../types'
import { Event } from '../Event'
import { EventType } from '../EventType'
import { FSM } from '../types'
import { ConnectingState } from './ConnectingState'
import type { ConnectionContext } from '../ConnectionContext'


export class ReconnectDelayState implements State {
    private readonly fsm: FSM
    private readonly ctx: ConnectionContext
    readonly name = "ReconnectDelay"
	
    constructor(fsm: FSM, ctx: ConnectionContext) {
        this.fsm = fsm
        this.ctx = ctx
    }

    enter() {
        this.fsm.startEventTimer({ type: EventType.RECONNECT }, 2500)
    }

    handle(event: Event) {
        if (event.type === EventType.RECONNECT) {
            this.fsm.setState(new ConnectingState(this.fsm, this.ctx))
        }
    }
}