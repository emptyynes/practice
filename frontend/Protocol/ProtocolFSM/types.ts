import type { Event } from './Event'
import type { EventType } from './EventType'


export interface Context { };

export interface State<T extends Context> {
	name: string;
	enter?: () => void;
	leave?: () => void;
	handle: (event: Event) => void;
}

export interface FSM<T extends Context> {
	emitEvent: (event: Event) => void;
	state: State<T>;
	startEventTimer: (event: Event, time: number) => void;
	setState: (state: State<T>) => void;
}