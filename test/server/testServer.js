var net = require('net'),
	server = net.createServer()

var port = 4001;

var sockets = [];

server.on('error', function (err){
	console.log('Server error: ', err.message)
})

server.on('close', function (err){
	console.log('Server closed.')
})

server.on('connection', function (socket){
	console.log('Got a new connection.')

	sockets.push(socket)

	socket.on('data', function (data){
		console.log('Got data: ', data)
	})

	socket.on('close', function(){
		console.log('Connection closed.')

		var index = sockets.indexOf(socket)
		sockets.splice(index, 1)
	})
})

server.listen(port)