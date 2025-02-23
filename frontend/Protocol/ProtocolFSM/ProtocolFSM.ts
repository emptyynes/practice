import type { AuthProvider } from '../types';
import { State, FSM, FSMStateAPI, FSMProtocolAPI } from './types';
import { Event, createEvent } from './Event';
import { EventType } from './EventType';
import { SharedContext } from './SharedContext';
import { IdleState } from './state/IdleState';
import { ConnectedState } from './state/ConnectedState';
import { WebSocketTransport } from '../WebSocketTransport';


export class ProtocolFSM implements FSM, FSMStateAPI, FSMProtocolAPI {
	private currentState: State;
	private futureState?: State;
	private isProcessingState: boolean = false;
	private stateId: number = 0;
	public ctx: SharedContext;
	public get state() {
		return this.currentState;
	}

	constructor(authProvider: AuthProvider) {
		this.ctx = new SharedContext(authProvider);
		this.currentState = new IdleState(this);
		console.log(`[FSM] Entering ${this.state.name}`) // eslint-disable-line
		if (this.state.enter) {this.state.enter();}
	}

	private processNextState() {
		if (this.isProcessingState) {
			return;
		}
		if (!this.futureState) {
			throw new Error("[FSM] no state to process");
		}

		this.isProcessingState = true;

		console.log(`[FSM] Leaving ${this.state.name} state`) // eslint-disable-line
		if (this.state.leave) {
			this.state.leave();
		}
		
		this.stateId++;
		this.currentState = this.futureState;
		
		console.log(`[FSM] Entering ${this.state.name} state`) // eslint-disable-line
		if (this.state.enter) {
			this.state.enter();
		}

		this.isProcessingState = false;
	}

	setState(state: State) {
		console.log(`[FSM] Moving from ${this.state.name} state to ${state.name}`) // eslint-disable-line
		this.futureState = state;
		this.processNextState();
	}

	handleEvent(event: Event) {
		if ((event.stateId) && (event.stateId !== this.stateId)) {
			console.warn(`event ${event.type} id does not match ${this.state.name} state id`);
		}

		setTimeout(() => {
			console.log(`[FSM] Handling ${event.type} at ${this.state.constructor.name}`) // eslint-disable-line
			if (this.state.handle) {this.state.handle(event);}
		}, 0);
	}

	emitEvent(type: EventType, payload?: unknown) {
		this.handleEvent(createEvent(type, this.stateId, payload));
	}

	startEventTimer(type: EventType, time: number, payload?: unknown) {
		console.log(`[FSM] Set timer for ${type} event ${time / 1000}s`) // eslint-disable-line
		setTimeout(() => {
			this.emitEvent(type, payload);
		}, time);
	}

	async send<T>(data: T, method: "get" | "post") {
		if (this.state instanceof ConnectedState) {
			try {
				return await this.ctx.webSocketTransport!.send<T>(data, method);
			} catch (error) {
				this.emitEvent(EventType.FAIL, error);
			}
		} else {
			throw new Error(`cannot send data in ${this.state.constructor.name}`);
		}
	}
}
