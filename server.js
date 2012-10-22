var fs = require('fs'),
	http = require('http'),
	socketio = require('socket.io');
 
var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html'));
}).listen(8080, function() {
    console.log('Listening at: http://localhost:8080');
});
 
socketio.listen(server).on('connection', function (socket) {
	socket.on('set nickname', function (name) {
		socket.set('nickname', name, function () {
			socket.emit('ready');
		});
	});

	socket.on('message', function (msg) {
		socket.get('nickname', function (err, name) {
			var message = name + ' diz: ' + msg;
			socket.broadcast.emit('message', message);
		});
	});
});