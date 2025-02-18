import { State } from '../types';
import { Event } from '../Event';
import { EventType } from '../EventType';
import { FSMStateAPI } from '../types';
import { IdleState } from './IdleState';
import { ConnectingState } from './ConnectingState';

export class ReconnectDelayState implements State {
	private readonly fsm: FSMStateAPI;
	readonly name = "ReconnectDelay";
	
	constructor(fsm: FSMStateAPI) {
		this.fsm = fsm;
	}

	enter() {
		this.fsm.startEventTimer(EventType.RECONNECT, 2500);
	}

	handle(event: Event) {
		if (event.type === EventType.RECONNECT)
			this.fsm.setState(new ConnectingState(this.fsm));
	}
}