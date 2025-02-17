import { ProtocolFSM } from './';


export class PingMonitor {
	private pingTimer?: NodeJS.Timeout;
	private lastStartTime = Date.now() // eslint-disable-line
	private working: boolean = true;
	private readonly fsm: ProtocolFSM;
	constructor(fsm: ProtocolFSM) {
		this.fsm = fsm;
		this.pingTimer = setTimeout(this.ping, 1000);
	}

	ping = () => {
		if (!this.working) return;
		let startTime = Date.now() // eslint-disable-line
		console.log(`time between pings: ${startTime - this.lastStartTime}`) // eslint-disable-line
		this.lastStartTime = startTime // eslint-disable-line
		this.fsm.send<string>("ping", "get").then((result) => {
			if (!this.working) {
				console.warn("pong after stopped");
				return;
			}
			let endTime = Date.now() // eslint-disable-line
			console.log(`ping time: ${endTime - startTime}`) // eslint-disable-line
			if (result !== "pong") {
				console.log(`THIS!!!! ${this.fsm.state.name}`)
				this.fsm.emitEvent("broken connection");
			} else
				this.pingTimer = setTimeout(this.ping, 1000);
		});
	};

	stop() {
		clearInterval(this.pingTimer);
		this.working = false;
	}
}