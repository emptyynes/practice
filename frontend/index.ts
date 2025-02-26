import { ServerConnection } from './Protocol/ServerConnection'
import { JWTAuthProvider } from './JWTAuthProvider'

export const auth = new JWTAuthProvider()

export const api = new ServerConnection(auth)

auth.init().then(() => {
    api.connect()

    setTimeout(async () => {
        try {
            console.log(await api.get("testget"))
        } catch (e) {
            console.log(`catched ${e}`)
        };
    }, 1000)
    setTimeout(async () => {
        try {
            console.log(await api.post("testpost"))
        } catch (e) {
            console.log(`catched ${e}`)
        };
    }, 2000)

	// setTimeout(async () => {
		// api.disconnect()
	// }, 1200)
})