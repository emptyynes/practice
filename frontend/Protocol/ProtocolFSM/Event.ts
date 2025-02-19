import type { State } from './types';
import type { EventType } from './EventType';


type constructorArgs = [EventType];
type constructorArgsWithId = [number, EventType];
type constructorArgsWithIdAndPayload<T> = [number, EventType, T];


// export class Event<T = void> {
// 	stateId?: number;
// 	payload?: T;
// 	type: EventType;

// 	constructor(type: EventType);
// 	constructor(stateId: number, type: EventType);
// 	constructor(stateId: number, type: EventType, payload: T);
// 	constructor(...args: constructorArgs | constructorArgsWithId | constructorArgsWithIdAndPayload<T>) {
// 		if (args.length === 1) {
// 			this.type = args[0];
// 		} else if (args.length === 2) {
// 			this.stateId = args[0];
// 			this.type = args[1];
// 		} else if (args.length === 3) {
// 			this.stateId = args[0];
// 			this.type = args[1];
// 			this.payload = args[2];
// 		} else {
// 			throw new Error(`illegal arguments to Event constructor: ${args}`);
// 		}
// 	}
// }

export interface BaseEvent {
	type: EventType;
	stateId: number;
	payload?: unknown;
}

export interface ConnectEvent extends BaseEvent {
	type: EventType.CONNECT;
}

export interface DisconnectEvent extends BaseEvent {
	type: EventType.DISCONNECT;
}

export interface ConnectedEvent extends BaseEvent {
	type: EventType.CONNECTED;
}

export interface NotConnectedEvent extends BaseEvent {
	type: EventType.NOT_CONNECTED;
}

export interface ReconnectEvent extends BaseEvent {
	type: EventType.RECONNECT;
}

export interface FailEvent extends BaseEvent {
	type: EventType.FAIL;
	payload: { reason: string };
}

export interface PingSuccessEvent extends BaseEvent {
	type: EventType.PING_SUCCESS;
}

export interface SendPingEvent extends BaseEvent {
	type: EventType.SEND_PING;
	payload: { time: number };
}

export interface AuthenticatedEvent extends BaseEvent {
	type: EventType.AUTHENTICATED;
}

export type Event = 
	ConnectEvent		| DisconnectEvent	| ConnectedEvent		|
	NotConnectedEvent	| ReconnectEvent	| FailEvent 			|
	PingSuccessEvent	| SendPingEvent		| AuthenticatedEvent

export function createEvent(type: EventType, stateId: number, payload?: unknown): Event {
	let event: Event = { type: type, stateId: stateId } as Event;
	if (payload) {
		event.payload = payload;
	}
	return event;
}