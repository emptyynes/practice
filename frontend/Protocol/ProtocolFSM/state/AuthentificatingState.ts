import { State } from '../types';
import { Event } from '../Event';
import { ProtocolFSM } from '../';
import { ConnectingState } from './ConnectingState';

export class AuthentificatingState implements State {
	private readonly fsm: ProtocolFSM;
	readonly name = "Authentificating";

	constructor(fsm: ProtocolFSM) {
		this.fsm = fsm;
	}

	enter() {
		this.fsm.authProvider.auth().then(() => {
			this.fsm.emitEvent("authentificated");
		});
	}

	handle(event: Event) {
		this.fsm.setState(new ConnectingState(this.fsm));
	}
}