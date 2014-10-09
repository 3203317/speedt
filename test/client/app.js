var net = require('net');

var port = 4001,
	host = '127.0.0.1';

var conn = net.createConnection(port, host, function(){
	console.log('We have a new connection.');
})

conn.on('connection', function(){
	console.log('Connected to server.')
})

conn.on('error', function (err){
	console.log('Error in connection: ', err)
})