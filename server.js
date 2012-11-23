var room = 1,
	users = {},
	fs = require('fs'),
	io = require('socket.io').listen(4000);

io.sockets.on('connection', function (socket) {
	var id;

	socket.on('set user', function (user) {
		id = user.user_id;
		users[id] = user.user_name;
		socket.join('room-' + room);
	});

	socket.on('message', function (msg) {
		var message = {
			sender_id: id,
			sender_name: users[id],
			message: msg
		};
		io.sockets.in('room-' + room).emit('message', message);
	});

	socket.on('disconnect', function () {
		delete users[id];
	});
});