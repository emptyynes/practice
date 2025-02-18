import { State } from '../types';
import { Event } from '../Event';
import { EventType } from '../EventType';
import { FSMStateAPI } from '../types';
import { ConnectingState } from './ConnectingState';

export class AuthentificatingState implements State {
	private readonly fsm: FSMStateAPI;
	readonly name = "Authentificating";

	constructor(fsm: FSMStateAPI) {
		this.fsm = fsm;
	}

	handle(event: Event) {
		if (event.type === EventType.AUTHENTIFICATED)
			this.fsm.setState(new ConnectingState(this.fsm));
	}
}