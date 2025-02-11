import { State, Event } from '../types';
import { ProtocolFSM } from './';
import { ConnectingState } from './ConnectingState';

export class AuthentificatingState implements State {
	private fsm: ProtocolFSM
	name = "Authentificating"

	constructor(fsm: ProtocolFSM) {
		this.fsm = fsm;
	}

	enter() {
		this.fsm.authProvider.auth().then(() => {
			this.fsm.event({
				state: "Authentificating",
				data: "authentificated"
			})
		})
	}

	handle(event: Event) {
		this.fsm.setState(new ConnectingState(this.fsm));
	}
}