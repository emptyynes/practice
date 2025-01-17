const users = {
	"admin": "admin",
	"user1": "user1",
	"user2": "user2",
	"user3": "user3",
	"user4": "user4"
};

export function authenticate(request) {
	if (request.headers.username && request.headers.password)
		return users[request.headers.username] == request.headers.password;
}