import type { AuthProvider } from './Protocol/types.ts';
import { endpoints } from './Protocol/config';

export class SimpleAuthProvider implements AuthProvider {
	isAuthentificated: boolean = false;

	constructor() {
		this.isAuthentificated = localStorage.auth ?? false;
		fetch(endpoints.authCheck).then(response => {
			this.isAuthentificated = response.status === 200;
			localStorage.auth = this.isAuthentificated;
		});
	}

	async auth() {
		let result = await fetch(`${endpoints.auth}?username=admin&password=admin`);
		fetch(endpoints.authCheck).then(response => {
			this.isAuthentificated = response.status === 200;
			localStorage.auth = this.isAuthentificated;
		});
		return result;
	}
}