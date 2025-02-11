import type { AuthProvider } from '../types';
import { State, Event, FSM } from '../types';
import { IdleState } from './IdleState';
import { ConnectedState } from './ConnectedState';
import { WebSocketTransport } from '../WebSocketTransport';


export class ProtocolFSM implements FSM {
	authProvider: AuthProvider
	private currentState: State
	private futureState?: State
	private isProcessingState: boolean = false
	wst?: WebSocketTransport

	public get state() {
		return this.currentState;
	}

	constructor(authProvider: AuthProvider) {
		this.authProvider = authProvider;
		this.currentState = new IdleState(this);
		console.log(`[FSM] Entering ${this.state.constructor.name}`)
		if (this.state.enter) this.state.enter();
	}

	private processNextState() {
		if (this.isProcessingState) return;
		this.isProcessingState = true;

		console.log(`[FSM] Leaving ${this.state.name} state`)
		if (this.state.leave) this.state.leave();
		this.currentState = this.futureState!;
		console.log(`[FSM] Entering ${this.state.name} state`)
		if (this.state.enter) this.state.enter();

		this.isProcessingState = false;
	}

	setState(state: State) {
		console.log(`[FSM] Moving from ${this.state.name} state to ${state.name}`)
		this.futureState = state;
		this.processNextState();
 	}

 	event(event: Event) {
 		if (event.state !== this.state.name) {
 			console.warn(`incorrect event ${event.state}${event.data} for state ${this.state.name}`);
 			return;
 		}

 		setTimeout(() => {
			console.log(`[FSM] Handling ${event.data} at ${this.state.constructor.name}`)
 			if (this.state.handle) this.state.handle(event);
 		}, 0)
 	}

	async send<T>(data: T) {
		if (this.state instanceof ConnectedState)
			return this.wst!.send<T>(data);
		else 
			throw new Error(`cannot send data in ${this.state.constructor.name}`);
	}
}
