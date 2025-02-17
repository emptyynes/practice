import express from 'express';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

const authRouter = express.Router();

// authRouter.use(bodyParser.urlencoded({extended : true}));
authRouter.use(express.json());

const users: Map<string, string> = new Map([
	["admin", "password"],
	["user1", "password1"],
	["user2", "password2"]
]);

authRouter.post('/login', (request, response) => {
	const { username, password } = request.body;

	if (users.get(username) !== password) {
		response.status(406).send("Invalid login/password");
		return;
	}

	const token = jwt.sign({ username: username }, "secret123", { expiresIn: '30d' });

	response.send(JSON.stringify({ token: token }))
});

authRouter.post('/refresh', (request, response) => {
	const { token } = request.body;
	jwt.verify(token, "secret123", (error: any, decoded: any) => {
		if (error) {
			response.status(406).send("bad refresh token")
		} else {
			let accessToken = jwt.sign({ username: decoded.username }, "secret1234", { expiresIn: '1d' });
			response.cookie("accessToken", accessToken, {
				secure: true,
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000 // 1 day
			});
			response.send(JSON.stringify({ token: accessToken }))
		}
	})
});

authRouter.get('/check', (request, response) => {
	let cookies = cookie.parse(request.headers.cookie || "");
	jwt.verify(cookies.accessToken || "", "secret1234", (error: any, decoded: any) => {
		if (error)
			response.status(401).send("Unauthorized");
		else
			response.status(200).send("Authorized");
	})
});

export default authRouter;