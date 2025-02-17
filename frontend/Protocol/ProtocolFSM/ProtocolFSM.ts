import type { AuthProvider } from '../types';
import { State, FSMStateAPI, FSMProtocolAPI } from './types';
import { Event } from './Event';
import { IdleState } from './state/IdleState';
import { ConnectedState } from './state/ConnectedState';
import { WebSocketTransport } from '../WebSocketTransport';


export class ProtocolFSM implements FSMStateAPI, FSMProtocolAPI {
	authProvider: AuthProvider;
	private currentState: State;
	private futureState?: State;
	private isProcessingState: boolean = false;
	wst?: WebSocketTransport;

	public get state() {
		return this.currentState;
	}

	constructor(authProvider: AuthProvider) {
		this.authProvider = authProvider;
		this.currentState = new IdleState(this);
		console.log(`[FSM] Entering ${this.state.name}`) // eslint-disable-line
		if (this.state.enter) this.state.enter();
	}

	private processNextState() {
		if (this.isProcessingState) return;
		this.isProcessingState = true;

		console.log(`[FSM] Leaving ${this.state.name} state`) // eslint-disable-line
		if (this.state.leave) this.state.leave();
		if (!this.futureState) throw new Error("[FSM] no state to process");
		this.currentState = this.futureState;
		console.log(`[FSM] Entering ${this.state.name} state`) // eslint-disable-line
		if (this.state.enter) this.state.enter();

		this.isProcessingState = false;
	}

	setState(state: State) {
		console.log(`[FSM] Moving from ${this.state.name} state to ${state.name}`) // eslint-disable-line
		this.futureState = state;
		this.processNextState();
 	}

 	event(event: Event) {
 		if (event.stateId !== this.state.id) {
 			console.warn(`event ${event.data} id does not match ${this.state.name} state id`);
 		}

 		setTimeout(() => {
			console.log(`[FSM] Handling ${event.data} at ${this.state.constructor.name}`) // eslint-disable-line
 			if (this.state.handle) this.state.handle(event);
 		}, 0);
 	}

 	emitEvent(data: string) {
 		this.event(new Event(this.state.id, data));
 	}

	async send<T>(data: T, method: "get" | "post") {
		if (this.state instanceof ConnectedState)
			return this.wst!.send<T>(data, method);
		else 
			throw new Error(`cannot send data in ${this.state.constructor.name}`);
	}
}
