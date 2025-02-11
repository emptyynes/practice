export interface AuthProvider {
	isAuthentificated: boolean;
	auth: () => Promise<Response>;
}

export type WebSocketRequest<T> =  {
	id: number;
	payload: T;
}

export type WebSocketResponse<T> = {
	id: number;
	payload: T;
}

export type Event = {
	state: string;
	data: string;
}

export interface State {
	name: string;
  enter?: () => void;
  leave?: () => void;
  handle?: (event: Event) => void;
}

export interface FSM {
  setState: (state: State) => void;
  event: (event: Event) => void;
}