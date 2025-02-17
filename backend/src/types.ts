export type WebSocketRequest<T> =  {
  id: number;
  method: "get" | "post";
  payload: T;
}

export type WebSocketResponse<T> = {
  id: number;
  payload: T;
}