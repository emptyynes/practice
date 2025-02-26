import type { AuthProvider } from './Protocol/types.ts'


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
        let response = await fetch(`/api/auth/check`, {
            headers: {
                Authentication: localStorage.accessToken
            }
        })
        this.isAuthenticated = response.ok
        return this.isAuthenticated
    }

    private async refresh() {
        let accessTokenRequest = await fetch(`/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: localStorage.refreshToken })
        })
        if (!accessTokenRequest.ok) {
            throw new Error(`[JWT AUTH] /api/auth/refresh -> ${accessTokenRequest.status}`)
        }
        localStorage.accessToken = JSON.parse(await accessTokenRequest.text()).token
    }

    async login(username: string, password: string) {
        let refreshTokenRequest = await fetch(`/api/auth/login`, {
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