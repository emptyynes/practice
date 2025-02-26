export enum EventType {
	CONNECT = "connect",
	CONNECTED = "connected",
	NOT_CONNECTED = "not connected",
	RECONNECT = "reconnect",
	DISCONNECT = "disconnect",
	FAIL = "broken connection",
	PING_SUCCESS = "ping success",
	SEND_PING = "time to send ping",
	AUTHENTICATE = "send authentication request",
	AUTHENTICATED = "user authenticated",
}