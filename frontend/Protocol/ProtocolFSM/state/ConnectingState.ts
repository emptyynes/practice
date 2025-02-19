import { State } from '../types';
import { Event } from '../Event';
import { EventType } from '../EventType';
import { FSMStateAPI } from '../types';
import { WebSocketTransport } from '../../WebSocketTransport';
import { ConnectedState } from './ConnectedState';
import { ReconnectDelayState } from './ReconnectDelayState';
import { AuthentificatingState } from './AuthentificatingState';
import { endpoints } from '../../config';


export class ConnectingState implements State {
	private readonly fsm: FSMStateAPI;
	readonly name = "Connecting";
	
	constructor(fsm: FSMStateAPI) {
		this.fsm = fsm;
	}

	enter() {
		if (!localStorage.accessToken) {
			this.fsm.emitEvent(EventType.NOT_CONNECTED);
			return;
		}

		fetch(endpoints.requestWSEndpoint, {
			headers: {
				Authentication: localStorage.accessToken
			}
		}).then(response => {
			if (!response.ok) {
				this.fsm.emitEvent(EventType.NOT_CONNECTED);
				return;
			}

			response.text().then((uid: string) => {
				this.fsm.ctx.webSocketTransport = new WebSocketTransport(window.location.host, uid);

				this.fsm.ctx.webSocketTransport.socket.addEventListener("open", (_) => {
					this.fsm.emitEvent(EventType.CONNECTED);
				});
			});
		});
	}

	handle(event: Event) {
		if (event.type === EventType.CONNECTED) {
			this.fsm.setState(new ConnectedState(this.fsm));
		} else if (event.type === EventType.NOT_CONNECTED) {
			this.fsm.setState(
				this.fsm.ctx.authProvider.isAuthenticated ?
				new ReconnectDelayState(this.fsm) : new AuthentificatingState(this.fsm)
			);
		}
	}
}