import type { State } from './types';
import type { EventType } from './EventType';

type constructorArgs = [EventType];
type constructorArgsWithId = [number, EventType];
type constructorArgsWithIdAndPayload<T> = [number, EventType, T];

export class Event<T = void> {
	stateId?: number;
	payload?: T;
	type: EventType;

	constructor(type: EventType);
	constructor(stateId: number, type: EventType);
	constructor(stateId: number, type: EventType, payload: T);
	constructor(...args: constructorArgs | constructorArgsWithId | constructorArgsWithIdAndPayload<T>) {
		if (args.length === 1) {
			this.type = args[0];
		} else if (args.length === 2) {
			this.stateId = args[0];
			this.type = args[1];
		} else if (args.length === 3) {
			this.stateId = args[0];
			this.type = args[1];
			this.payload = args[2];
		} else throw new Error(`illegal arguments to Event constructor: ${args}`)
	}
}