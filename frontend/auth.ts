import type { AuthProvider } from './types.ts';

export class SimpleAuthProvider implements AuthProvider {
	isAuthentificated: boolean = false

	constructor() {
		fetch('/api/authCheck').then(response => {
			this.isAuthentificated = response.status === 200
		})
	}

	async auth(username: string, password: string) {
		let result = await fetch(`/api/auth?username=${username}&password=${password}`);
		fetch('/api/authCheck').then(response => { this.isAuthentificated = response.status === 200 })
		return result;
	}
}