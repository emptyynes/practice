import { State } from '../types'
import { Event } from '../Event'
import { EventType } from '../EventType'
import { FSM } from '../types'
import { ConnectingState } from './ConnectingState'
import type { ConnectionContext } from '../ConnectionContext'


export class AuthentificatingState implements State {
    private readonly fsm: FSM
    private readonly ctx: ConnectionContext
    readonly name = "Authentificating"

    constructor(fsm: FSM, ctx: ConnectionContext) {
        this.fsm = fsm
        this.ctx = ctx
    }

    enter() {
        this.fsm.emitEvent({ type: EventType.AUTHENTICATE })
    }

    handle(event: Event) {
        if (event.type === EventType.AUTHENTICATE) {
            this.ctx.authProvider.auth()
                .then(() => {
                    this.fsm.emitEvent({ type: EventType.AUTHENTICATED })
                })
                .catch((error) => {
                    console.error(`[AUTH STATE] ${error}`)
                    this.fsm.startEventTimer({ type: EventType.AUTHENTICATE }, 3000)
                })
        } else if (event.type === EventType.AUTHENTICATED) {
            this.fsm.setState(new ConnectingState(this.fsm, this.ctx))
        }
    }
}