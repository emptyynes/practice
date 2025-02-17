import { State } from '../types';
import { Event } from '../Event';
import { FSMStateAPI } from '../types';
import { WebSocketTransport } from '../../WebSocketTransport';
import { ConnectedState } from './ConnectedState';
import { ReconnectDelayState } from './ReconnectDelayState';
import { AuthentificatingState } from './AuthentificatingState';
import { endpoints } from '../../config';

export class ConnectingState implements State {
	private readonly fsm: FSMStateAPI;
	readonly name = "Connecting";
	id: number;
	
	constructor(fsm: FSMStateAPI) {
		this.fsm = fsm;
		this.id = fsm.state.id + 1;
	}

	enter() {
		fetch(endpoints.requestWSEndpoint).then(response => {
			if (!response.ok) {
				this.fsm.emitEvent("fail");
				return;
			}
			response.text().then((uid: string) => {
				this.fsm.wst = new WebSocketTransport(window.location.host, uid);

				this.fsm.wst.socket.addEventListener("open", (_) => {
					this.fsm.emitEvent("connect");
				});
			});
		});
	}

	handle(event: Event) {
		if (event.data === "connect")
			this.fsm.setState(new ConnectedState(this.fsm));
		else if (event.data === "fail") {
			if (this.fsm.authProvider.isAuthentificated)
				this.fsm.setState(new ReconnectDelayState(this.fsm));
			else
				this.fsm.setState(new AuthentificatingState(this.fsm));
		}
	}
}