import express from 'express';
import cookie from 'cookie';
const authRouter = express.Router();

authRouter.get('/api/auth', (request, response) => {
  if (request.query.username && request.query.password) {
    const options = {
      secure: true,
      httpOnly: true,
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000 // 6 months
    };

    response.cookie("username", request.query.username, options);
    response.cookie("password", request.query.password, options);

    response.send("authenficated");
  }
});

authRouter.get('/api/auth/check', (request, response) => {
  let cookies = cookie.parse(request.headers.cookie || "");
  if (cookies.username && cookies.password)
    response.status(200).send("Authorized");
  else
    response.status(401).send("Unauthorized");
});

export default authRouter;