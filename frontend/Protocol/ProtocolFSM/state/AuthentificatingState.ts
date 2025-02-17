import { State } from '../types';
import { Event } from '../Event';
import { FSMStateAPI } from '../types';
import { ConnectingState } from './ConnectingState';

export class AuthentificatingState implements State {
	private readonly fsm: FSMStateAPI;
	readonly name = "Authentificating";
	id: number;

	constructor(fsm: FSMStateAPI) {
		this.fsm = fsm;
		this.id = fsm.state.id + 1;
	}

	handle(event: Event) {
		if (event.data === "authentificated")
			this.fsm.setState(new ConnectingState(this.fsm));
	}
}