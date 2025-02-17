export interface AuthProvider {
	isAuthentificated: boolean;
	auth: () => Promise<Response>;
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
