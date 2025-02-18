import { State } from '../types';
import { Event } from '../Event';
import { EventType } from '../EventType';
import { FSMStateAPI } from '../types';
import { ConnectingState } from './ConnectingState';
import { AuthentificatingState } from './AuthentificatingState';

export class IdleState implements State {
	private readonly fsm: FSMStateAPI;
	readonly name = "Idle";
	
	constructor(fsm: FSMStateAPI) {
		this.fsm = fsm;
	}

	handle(event: Event) {
		if (event.type === EventType.CONNECT) {
			if (this.fsm.ctx.authProvider.isAuthentificated)
				this.fsm.setState(new ConnectingState(this.fsm));
			else
				this.fsm.setState(new AuthentificatingState(this.fsm));
		}
	}
}