/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	net = require('net');

var utils = require('../util/utils'),
	HyxSocket = require('./hyxsocket');

var curId = 1;

var Connector = function(server, opts){
	var self = this;
	if(!(self instanceof Connector))
		return new Connector(server, opts);

	EventEmitter.call(self);

	self.opts = opts || {};
	self.server = server;
	self.port = server.clientPort;
	self.host = server.host;
	self.ssl = opts.ssl;
}

util.inherits(Connector, EventEmitter);

module.exports = Connector;

var pro = Connector.prototype;

pro.start = function(cb){
	var self = this;

	if(!self.ssl){
		var tcpServer = self.tcpServer = net.createServer();

		// self.switcher.on('connection', gensocket.bind(self));

		tcpServer.on('connection', newSocket.bind(self));

		tcpServer.listen(self.port, function(){
			console.log('[%s] TcpServer %j is started.', utils.format(new Date), self.server.id);
		});

		/* self.sockets = [];

		tcpServer.on('error', function (err){
			console.error('[%s] Server error: %j.', utils.format(new Date), err)
		});

		tcpServer.on('close', function (err){
			if(err) console.error('[%s] Server error: %j.', utils.format(new Date), err);
			console.log('[%s] Server closed.', utils.format(new Date));
		});

		tcpServer.on('connection', function (socket){
			socket.name = socket.remoteAddress +':'+ socket.remotePort
			self.sockets.push(socket)
			console.log('Got a new connection: %s. Connection count: %s.', socket.name, self.sockets.length)

			socket.on('data', function (data){
				console.log('Got data: ', data)
			})

			socket.on('close', function(){
				var index = self.sockets.indexOf(socket)
				self.sockets.splice(index, 1)

				console.log('Connection closed: %s. Connection count: %s.', socket.name, self.sockets.length)
			})

			socket.on('error', function (err){
				console.log(err)
			})
		});

		tcpServer.listen(self.port, function(){
			console.log('[%s] TcpServer is started.', utils.format(new Date));
		}); */
	}

	process.nextTick(cb);
}

pro.stop = function(force, cb){
	this.tcpServer.close();
	process.nextTick(cb);
}

function newSocket(socket){
	console.log('[%s] New socket: %s:%s.', utils.format(new Date), socket.remoteAddress, socket.remotePort)
	gensocket.bind(this, socket)();
}

function gensocket(socket){
	var self = this;
	var hyxsocket = new HyxSocket(curId++, socket);
	// hyxsocket.on('disconnect', self.heartbeat.clear.bind(self.heartbeat, hyxsocket.id));
	self.emit('connection', hyxsocket);
}
