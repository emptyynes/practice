import { State, FSM } from './types'
import { EventWrapper, Event } from './Event'
import { ConnectionContext } from './ConnectionContext'
import { IdleState } from './state/IdleState'


export class ProtocolFSM implements FSM {
    private currentState: State
    private futureState?: State
    private isProcessingState: boolean = false
    private stateId: number = 0
    public get state() {
        return this.currentState
    }

    constructor(ctx: ConnectionContext) {
        this.currentState = new IdleState(this, ctx)
        console.log(`[FSM] Entering ${this.state.name}`)  
        if (this.state.enter) {
            this.state.enter()
        }
    }

    private processNextState() {
        if (this.isProcessingState) {
            return
        }
        if (!this.futureState) {
            throw new Error("[FSM] no state to process")
        }

        this.isProcessingState = true
        console.log(`[FSM] Leaving ${this.state.name} state`)
        this.state.leave?.()

        this.stateId++
        this.currentState = this.futureState
        this.futureState = undefined
        
        console.log(`[FSM] Entering ${this.state.name} state`)  
        this.state.enter?.()
        this.isProcessingState = false
    }

    setState(state: State) {
        console.log(`[FSM] Moving from ${this.state.name} state to ${state.name}`)  
        this.futureState = state
        this.processNextState()
    }

    private handleEvent(wrapper: EventWrapper) {
        if ((wrapper.stateId) && (wrapper.stateId !== this.stateId)) {
            console.warn(`event ${wrapper.event.type} id does not match ${this.state.name} state id`)
            return
        }

        setTimeout(() => {
            console.log(`[FSM] Handling ${wrapper.event.type} at ${this.state.constructor.name}`)  
            if (this.state.handle) {
                this.state.handle(wrapper.event)
            }
        }, 0)
    }

    emitEvent(event: Event) {
        this.handleEvent({
            stateId: this.stateId,
            event
        })
    }

    startEventTimer(event: Event, time: number) {
        console.log(`[FSM] Set timer for ${event.type} event ${time / 1000}s`)  
        setTimeout(() => {
            this.emitEvent(event)
        }, time)
    }
}
