export interface AuthProvider {
	isAuthentificated: boolean;
	auth: (username: string, password: string) => Promise<Response>;
}

export type WebSocketRequest<T> =  {
	id: number;
	payload: T;
}

export type WebSocketResponse<T> = {
	id: number;
	payload: T;
}


export enum State {
  Idle = 'idle',
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnecting = 'disconnecting',
  Reconnecting = 'reconnecting',
  Authentification = 'authentification'
}

export enum Event {
  Connect = 'connect',
  Disconnect = 'disconnect',
  Authentificate = 'authentificate',
  Authentificated = 'authentificated',
  Reconnect = 'reconnect',
  Reconnected = 'reconnected'
}


export type TransitionMap = {
  [key in State]: Partial<Record<Event, State>>;
};