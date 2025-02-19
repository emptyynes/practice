import { State } from '../types';
import { Event } from '../Event';
import { EventType } from '../EventType';
import { FSMStateAPI } from '../types';
import { IdleState } from './IdleState';
import { ReconnectDelayState } from './ReconnectDelayState';


export class ConnectedState implements State {
	private readonly fsm: FSMStateAPI;
	readonly name = "Connected";
	
	constructor(fsm: FSMStateAPI) {
		this.fsm = fsm;
	}

	private socketCloseEventHandler = () => {
		this.fsm.emitEvent(EventType.FAIL, { reason: "socket closed" });
	};

	enter() {
		this.fsm.emitEvent(EventType.SEND_PING, { time: Date.now() });
		this.fsm.ctx.webSocketTransport!.socket.addEventListener("close", this.socketCloseEventHandler);
	}

	handle(event: Event) {
		switch (event.type) {
			case EventType.DISCONNECT: {
				this.fsm.setState(new IdleState(this.fsm));
				break;
			}
			case EventType.FAIL: {
				console.error(event.payload.reason);
				this.fsm.setState(new ReconnectDelayState(this.fsm));
				break;
			}
			case EventType.SEND_PING: {
				this.fsm.ctx.webSocketTransport!.send<string>("ping", "get", 3000)
					.then(success => {
						console.log(`[PING] time between ping: ${(Date.now() - event.payload.time) / 1000}s`) // eslint-disable-line
						this.fsm.emitEvent(EventType.PING_SUCCESS);
					}).catch(failed => {
						console.warn("ping failed") // eslint-disable-line
						this.fsm.emitEvent(EventType.FAIL, { reason: "ping failed" });
					});
				break;
			}
			case EventType.PING_SUCCESS: {
				this.fsm.startEventTimer(EventType.SEND_PING, 1000, { time: Date.now() });				
				break;
			}
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