import { State } from '../types';
import { Event } from '../Event';
import { ProtocolFSM } from '../';
import { WebSocketTransport } from '../../WebSocketTransport';
import { ConnectedState } from './ConnectedState';
import { ReconnectDelayState } from './ReconnectDelayState';
import { endpoints } from '../../config';

export class ConnectingState implements State {
	private readonly fsm: ProtocolFSM;
	readonly name = "Connecting";
	
	constructor(fsm: ProtocolFSM) {
		this.fsm = fsm;
	}

	enter() {
		fetch(endpoints.requestWSEndpoint).then((result) => {
			if (!result.ok) return this.fsm.emitEvent("fail");
			result.text().then((uid: string) => {
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
		else if (event.data === "fail")
			this.fsm.setState(new ReconnectDelayState(this.fsm));
	}
}