import { State, Event } from '../types';
import { ProtocolFSM } from './';
import { IdleState } from './IdleState';
import { ConnectingState } from './ConnectingState';

export class ConnectedState implements State {
	private fsm: ProtocolFSM
	private pingTimer?: NodeJS.Timeout
	name = "Connected"
	constructor(fsm: ProtocolFSM) {
		this.fsm = fsm;
	}

	private lastStartTime = Date.now()
	ping = () => {
		let startTime = Date.now()
		console.log(`time between pings: ${startTime - this.lastStartTime}`)
		this.lastStartTime = startTime
		this.fsm.send<string>("ping").then((result) => {
			let endTime = Date.now()
			console.log(`ping time: ${endTime - startTime}`)
			if (result !== "pong") {
				this.fsm.event({
					state: "Connected",
					data: "broken connection"
				})
			} else
				this.pingTimer = setTimeout(this.ping, 1000);
		});
	}

	enter() {
		this.pingTimer = setTimeout(this.ping, 1000);
	}

	handle(event: Event) {
		if (event.data === "disconnect") {
			this.fsm.setState(new IdleState(this.fsm));
		} else if (event.data === "broken connection") {
			this.fsm.setState(new ConnectingState(this.fsm));
		}
	}

	leave() {
		clearInterval(this.pingTimer);
		this.fsm.wst!.disconnect();
	}
}