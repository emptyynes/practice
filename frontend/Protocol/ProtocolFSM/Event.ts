import type { EventType } from './EventType'


export interface ConnectEvent {
	type: EventType.CONNECT;
}

export interface DisconnectEvent {
	type: EventType.DISCONNECT;
}

export interface ConnectedEvent {
	type: EventType.CONNECTED;
}

export interface NotConnectedEvent {
	type: EventType.NOT_CONNECTED;
}

export interface ReconnectEvent {
	type: EventType.RECONNECT;
}

export interface FailEvent {
	type: EventType.FAIL;
	payload: { reason: string; };
}

export interface PingSuccessEvent {
	type: EventType.PING_SUCCESS;
}

export interface SendPingEvent {
	type: EventType.SEND_PING;
	payload: { time: number; };
}

export interface AuthenticatedEvent {
	type: EventType.AUTHENTICATED;
}

export interface AuthenticateEvent {
	type: EventType.AUTHENTICATE;
}

export type Event = 
	ConnectEvent		| DisconnectEvent	| ConnectedEvent |
	NotConnectedEvent	| ReconnectEvent	| FailEvent |
	PingSuccessEvent	| SendPingEvent 	| AuthenticatedEvent |
	AuthenticateEvent

export interface EventWrapper {
	stateId?: number;
	event: Event;
}