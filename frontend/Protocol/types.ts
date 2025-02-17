export interface AuthProvider {
	isAuthentificated: boolean;
	init: (authSuccessCallback: () => void, authFailedCallback: () => void) => Promise<boolean>;
	auth: (username: string, password: string) => Promise<void>;
}

export type WebSocketRequest<T> =  {
	id: number;
	method: "get" | "post";
	payload: T;
}

export type WebSocketResponse<T> = {
	id: number;
	payload: T;
}
