import { State } from '../types'
import { Event } from '../Event'
import { EventType } from '../EventType'
import { FSM } from '../types'
import { ConnectingState } from './ConnectingState'
import { AuthentificatingState } from './AuthentificatingState'
import type { ConnectionContext } from '../ConnectionContext'


export class IdleState implements State<ConnectionContext> {
    private readonly fsm: FSM<ConnectionContext>
    private readonly ctx: ConnectionContext
    readonly name = "Idle"
	
    constructor(fsm: FSM<ConnectionContext>, ctx: ConnectionContext) {
        this.fsm = fsm
        this.ctx = ctx
    }

    handle(event: Event) {
        if (event.type === EventType.CONNECT) {
            this.fsm.setState(
				this.ctx.authProvider.isAuthenticated ?
				new ConnectingState(this.fsm, this.ctx) : new AuthentificatingState(this.fsm, this.ctx)
            )
        }
    }
}