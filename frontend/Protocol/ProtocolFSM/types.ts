import type { Event } from './Event';
import type { AuthProvider } from '../types';
import type { WebSocketTransport } from '../WebSocketTransport';

export interface State {
	name: string;
	id: number;
	enter?: () => void;
	leave?: () => void;
	handle: (event: Event) => void;
}

export interface FSMStateAPI {
	emitEvent: (data: string) => void;  
	setState: (state: State) => void;
	authProvider: AuthProvider;
	state: State;
	wst?: WebSocketTransport;
}

export interface FSMProtocolAPI {
	emitEvent: (data: string) => void;  
	event: (event: Event) => void;
	send: <T>(data: T, method: "get" | "post") => Promise<unknown>;
	state: State;
}