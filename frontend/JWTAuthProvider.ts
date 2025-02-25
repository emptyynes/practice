import type { AuthProvider } from './Protocol/types.ts'
import { endpoints } from './Protocol/config'


export class JWTAuthProvider implements AuthProvider {
	isAuthenticated: boolean = false
	private authSuccessCallback?: () => void = undefined
	private authFailedCallback?: () => void = undefined

	async init() {
		if (await this.check()) {
			return true
		}

		try {
			await this.refresh()
		} catch {}
		return await this.check()
	}

	private async check() {
		let response = await fetch(`${endpoints.auth}/check`, {
			headers: {
				Authentication: localStorage.accessToken
			}
		})
		this.isAuthenticated = response.ok
		return this.isAuthenticated
	}

	private async refresh() {
		let accessTokenRequest = await fetch(`${endpoints.auth}/refresh`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token: localStorage.refreshToken })
		})
		localStorage.accessToken = JSON.parse(await accessTokenRequest.text()).token
	}

	async login(username: string, password: string) {
		let refreshTokenRequest = await fetch(`${endpoints.auth}/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username: username, password: password })
		})
		if (!refreshTokenRequest.ok) {
			localStorage.auth = false
			if (this.authFailedCallback) {
				this.authFailedCallback()
			}
			return
		}
		localStorage.refreshToken = JSON.parse(await refreshTokenRequest.text()).token

		await this.refresh()

		if (this.authSuccessCallback) {
			this.authSuccessCallback()
		}
	}

	async auth() {
		if (!localStorage.refreshToken) {
			throw new Error("no refresh token")
		}

		if (!await this.check()) {
			await this.refresh()
		}

		if (this.authSuccessCallback) {
			this.authSuccessCallback()
		}
	}
}