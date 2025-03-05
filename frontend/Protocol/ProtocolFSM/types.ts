import type { Event } from './Event'


export interface State {
	name: string;
	enter?: () => void;
	leave?: () => void;
	handle: (event: Event) => void;
}

export interface FSM {
	emitEvent: (event: Event) => void;
	state: State;
	startEventTimer: (event: Event, time: number) => void;
	setState: (state: State) => void;
}