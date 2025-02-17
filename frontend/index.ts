import { ProtocolAPI } from './Protocol/ProtocolAPI';
import { SimpleAuthProvider } from './auth';

let auth = new SimpleAuthProvider();

export const api = new ProtocolAPI(auth);

api.connect()
setTimeout(async () => {
	console.log(await api.get("testget"));
}, 1000)
setTimeout(async () => {
	console.log(await api.post("testpost"));
}, 2000)
// setTimeout(() => {
// 	api.disconnect()
// }, 1200)