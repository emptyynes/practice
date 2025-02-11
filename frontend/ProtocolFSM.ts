import type { TransitionMap } from './types';
import { State, Event } from './types';

export class ProtocolFSM {
	private state: State = State.Idle;
	private static transitions: TransitionMap = {
		[State.Idle]: {
			[Event.Connect]: State.Connecting
		},
		[State.Connecting]: {
			[Event.Connect]: State.Connected,
			[Event.Authentificate]: State.Authentification
		},
		[State.Connected]: {
			[Event.Disconnect]: State.Disconnecting,
			[Event.Reconnect]: State.Reconnecting
		},
		[State.Disconnecting]: {
			[Event.Disconnect]: State.Idle
		},

		[State.Authentification]: {
			[Event.Authentificated]: State.Connecting
		},
		[State.Reconnecting]: {
			[Event.Reconnect]: State.Connected
		}
	};

	sendEvent(event: Event) {
		const nextState = ProtocolFSM.transitions[this.state][event];

		if (nextState) {
			this.state = nextState;
			this.handleState(this.state);
		}
 	}

 	handleState(state: State) {
 		console.log(`handling ${state}`)
 	}

	// wst: WebSocketTransport

	send(data: unknown) {
		if (this.state !== State.Connected)
			throw new Error(`Cannot send data in state: ${this.state}`)
		console.log(`sent ${data}`);
	}
}
