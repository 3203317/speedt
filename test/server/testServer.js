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
	socket.name = socket.remoteAddress +':'+ socket.remotePort
	sockets.push(socket)
	console.log('Got a new connection: %s. Connection count: %s.', socket.name, sockets.length)

	socket.on('data', function (data){
		console.log('Got data: ', data)
	})

	socket.on('close', function(){
		var index = sockets.indexOf(socket)
		sockets.splice(index, 1)

		console.log('Connection closed: %s. Connection count: %s.', socket.name, sockets.length)
	})

	socket.on('error', function (err){
		console.log(err)
	})
})

server.listen(port, function(){
	console.log('Server is started.')
})
