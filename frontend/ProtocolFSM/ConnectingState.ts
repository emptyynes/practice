import { State, Event } from '../types';
import { ProtocolFSM } from './';
import { WebSocketTransport } from '../WebSocketTransport';
import { ConnectedState } from './ConnectedState';


export class ConnectingState implements State {
	private fsm: ProtocolFSM
	name = "Connecting"
	constructor(fsm: ProtocolFSM) {
		this.fsm = fsm;
	}

	enter() { // TODO: CLEAN THIS
		let retries = 3;

		let connectionProcess = () => {
			if (retries === 0) throw new Error("server not available");
			retries--;
			fetch("/api/startUpgrade").then((result) => {
				if (result.status === 200) result.text().then((uid) => {
					console.log(uid)
					this.fsm.wst = new WebSocketTransport(uid);

					this.fsm.wst.socket.addEventListener("open", (_) => {
						this.fsm.event({ state: "Connecting", data: "connect" });
					});
				})
				else setTimeout(connectionProcess, 3000);
			})
		}

		connectionProcess();
	}

	handle(event: Event) {
		if (event.data === "connect")
			this.fsm.setState(new ConnectedState(this.fsm));
	}
}