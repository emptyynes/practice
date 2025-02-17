import { State } from '../types';
import { Event } from '../Event';
import { ProtocolFSM } from '../';
import { PingMonitor } from '../PingMonitor';
import { IdleState } from './IdleState';
import { ReconnectDelayState } from './ReconnectDelayState';

export class ConnectedState implements State {
	private readonly fsm: ProtocolFSM;
	private pinger?: PingMonitor;
	readonly name = "Connected";
	
	constructor(fsm: ProtocolFSM) {
		this.fsm = fsm;
	}

	private socketCloseEventHandler = () => {
		this.fsm.emitEvent("broken connection");
	}

	enter() {
		this.pinger = new PingMonitor(this.fsm);

		this.fsm.wst!.socket.addEventListener("close", this.socketCloseEventHandler);
	}

	handle(event: Event) {
		if (event.data === "disconnect") {
			this.fsm.wst!.socket.removeEventListener("close", this.socketCloseEventHandler);
			this.fsm.setState(new IdleState(this.fsm));
		} else if (event.data === "broken connection") {
			this.fsm.wst!.socket.removeEventListener("close", this.socketCloseEventHandler);
			this.fsm.setState(new ReconnectDelayState(this.fsm));
		}
	}

	leave() {
		this.pinger!.stop();
		this.fsm.wst!.disconnect();
	}
}