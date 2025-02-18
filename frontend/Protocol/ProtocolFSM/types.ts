import type { Event } from './Event';
import type { EventType } from './EventType';
import type { SharedContext } from './SharedContext';

type requestMethod = "get" | "post";

export interface State {
	name: string;
	enter?: () => void;
	leave?: () => void;
	handle: (event: Event) => void;
}

export interface FSM {
	emitEvent: (type: EventType) => void;
	handleEvent: (event: Event) => void;
	state: State;
	// stateId: number;
	startEventTimer: (type: EventType, time: number) => void;
	setState: (state: State) => void;
}

export interface FSMStateAPI extends FSM {
	ctx: SharedContext;
}

export interface FSMProtocolAPI extends FSM {
	send: <T>(data: T, method: requestMethod) => Promise<unknown>;
}