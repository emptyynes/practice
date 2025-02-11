import { ProtocolFSM } from './ProtocolFSM';
import { SimpleAuthProvider } from './auth';
import { State } from './types';

let auth = new SimpleAuthProvider();

export const fsm = new ProtocolFSM(auth);

fsm.event({
	state: "Idle",
	data: "connect"
});

setTimeout(() => {
	// fsm.event("disconnect");
}, 2000)
