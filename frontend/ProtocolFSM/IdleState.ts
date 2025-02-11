import { State, Event } from '../types';
import { ProtocolFSM } from './';
import { ConnectingState } from './ConnectingState';
import { AuthentificatingState } from './AuthentificatingState';

export class IdleState implements State {
	private fsm: ProtocolFSM
	name = "Idle"
	
	constructor(fsm: ProtocolFSM) {
		this.fsm = fsm;
	}

	handle(event: Event) {
		if (event.data === "connect") {
			if (this.fsm.authProvider.isAuthentificated)
				this.fsm.setState(new ConnectingState(this.fsm));
			else
				this.fsm.setState(new AuthentificatingState(this.fsm));
		}
	}
}