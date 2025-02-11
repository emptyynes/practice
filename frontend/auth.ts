import type { AuthProvider } from './types.ts';

export class SimpleAuthProvider implements AuthProvider {
	isAuthentificated: boolean = false

	constructor() {
		this.isAuthentificated = localStorage.auth ?? false;
		fetch('/api/authCheck').then(response => {
			this.isAuthentificated = response.status === 200;
			localStorage.auth = this.isAuthentificated;
		})
	}

	async auth() {
		let result = await fetch(`/api/auth?username=admin&password=admin`);
		fetch('/api/authCheck').then(response => {
			this.isAuthentificated = response.status === 200;
			localStorage.auth = this.isAuthentificated;
		})
		return result;
	}
}