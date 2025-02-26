export interface AuthProvider {
	isAuthenticated: boolean;
	init: () => Promise<boolean>;
	auth: () => Promise<void>;
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
