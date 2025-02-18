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
			this.fsm.setState(
				this.fsm.ctx.authProvider.isAuthentificated ?
				new ConnectingState(this.fsm) : new AuthentificatingState(this.fsm)
			);
		}
	}
}