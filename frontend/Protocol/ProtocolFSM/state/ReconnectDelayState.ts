import { State } from '../types';
import { Event } from '../Event';
import { FSMStateAPI } from '../types';
import { IdleState } from './IdleState';
import { ConnectingState } from './ConnectingState';

export class ReconnectDelayState implements State {
	private readonly fsm: FSMStateAPI;
	readonly name = "ReconnectDelay";
	id: number;
	
	constructor(fsm: FSMStateAPI) {
		this.fsm = fsm;
		this.id = fsm.state.id + 1;
	}

	enter() {
		setTimeout(() => {
			this.fsm.emitEvent("retry");
		}, 1000);
	}

	handle(event: Event) {
		if (event.data === "retry")
			this.fsm.setState(new ConnectingState(this.fsm));
	}
}