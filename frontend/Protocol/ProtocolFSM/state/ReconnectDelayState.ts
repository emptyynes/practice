import { State } from '../types';
import { Event } from '../Event';
import { ProtocolFSM } from '../';
import { IdleState } from './IdleState';
import { ConnectingState } from './ConnectingState';

export class ReconnectDelayState implements State {
	private readonly fsm: ProtocolFSM;
	readonly name = "ReconnectDelay";
	
	constructor(fsm: ProtocolFSM) {
		this.fsm = fsm;
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