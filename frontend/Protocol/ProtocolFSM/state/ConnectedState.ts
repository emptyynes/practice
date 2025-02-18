import { State } from '../types';
import { Event } from '../Event';
import { EventType } from '../EventType';
import { FSMStateAPI } from '../types';
import { IdleState } from './IdleState';
import { ReconnectDelayState } from './ReconnectDelayState';


export class ConnectedState implements State {
	private readonly fsm: FSMStateAPI;
	readonly name = "Connected";
	private lastPingTime = Date.now();
	
	constructor(fsm: FSMStateAPI) {
		this.fsm = fsm;
	}

	private socketCloseEventHandler = () => {
		this.fsm.emitEvent(EventType.FAIL);
	};

	enter() {
		this.fsm.emitEvent(EventType.SEND_PING);
		this.fsm.ctx.webSocketTransport!.socket.addEventListener("close", this.socketCloseEventHandler);
	}

	handle(event: Event) {
		if (event.type === EventType.DISCONNECT) {
			this.fsm.setState(new IdleState(this.fsm));
		} else if (event.type === EventType.FAIL) {
			this.fsm.setState(new ReconnectDelayState(this.fsm));
		} else if (event.type === EventType.SEND_PING) {
			this.fsm.ctx.webSocketTransport!.send<string>("ping", "get", 3000)
				.then(success => this.fsm.emitEvent(EventType.PING_SUCCESS))
				.catch(failed => this.fsm.emitEvent(EventType.FAIL));
		} else if (event.type === EventType.PING_SUCCESS) {
			console.log(`[PING] ${Date.now() - this.lastPingTime}`) // eslint-disable-line
			this.lastPingTime = Date.now();
			this.fsm.startEventTimer(EventType.SEND_PING, 1000);
		}
	}

	leave() {
		if (this.fsm.ctx.webSocketTransport) {
			this.fsm.ctx.webSocketTransport.socket.removeEventListener("close", this.socketCloseEventHandler);
			this.fsm.ctx.webSocketTransport.disconnect();
			this.fsm.ctx.webSocketTransport = undefined;
		} else {
			console.error("fsm.ctx.webSocketTransport does not exist when leaving ConnectedState");
		}
	}
}