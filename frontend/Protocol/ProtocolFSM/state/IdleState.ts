import { State } from '../types';
import { Event } from '../Event';
import { FSMStateAPI } from '../types';
import { ConnectingState } from './ConnectingState';
import { AuthentificatingState } from './AuthentificatingState';

export class IdleState implements State {
	private readonly fsm: FSMStateAPI;
	readonly name = "Idle";
	id: number;
	
	constructor(fsm: FSMStateAPI) {
		this.fsm = fsm;
		if (fsm.state) this.id = fsm.state.id + 1;
		else this.id = 0;
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