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
	Heartbeat = require('./commands/heartbeat'),
	HyxSocket = require('./hyxsocket'),
	Switcher = require('./hyx/switcher');

var curId = 1;

var Connector = function(port, host, opts){
	var self = this;
	if(!(self instanceof Connector))
		return new Connector(port, host, opts);

	EventEmitter.call(self);

	self.opts = opts || {};
	self.port = port;
	self.host = host;
	self.heartbeat = new Heartbeat(opts);
	self.ssl = opts.ssl;
}

util.inherits(Connector, EventEmitter);

module.exports = Connector;

var pro = Connector.prototype;

pro.start = function(cb){
	var self = this;

	if(self.ssl){
		// TODO
	}else{
		self.tcpServer = net.createServer();
		self.switcher = new Switcher(this.tcpServer, self.opts);

		self.switcher.on('connection', function (socket){
			gensocket(socket);
		});

		self.tcpServer.listen(self.port);

		/*self.sockets = [];

		self.tcpServer.on('error', function (err){
			console.error('[%s] Server error: %j.', utils.format(new Date), err)
		});

		this.tcpServer.on('close', function (err){
			if(err) console.error('[%s] Server error: %j.', utils.format(new Date), err);
			console.log('[%s] Server closed.', utils.format(new Date));
		});

		this.tcpServer.on('connection', function (socket){
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

		this.tcpServer.listen(this.port, function(){
			console.log('[%s] TcpServer is started.', utils.format(new Date));
		});*/
	}

	process.nextTick(cb);
}

pro.stop = function(force, cb){
	this.tcpServer.close();
	process.nextTick(cb);
}

function gensocket(connector, socket){
	var hyxsocket = new HyxSocket(curId++, socket);
	hyxsocket.on('heartbeat', connector.heartbeat.handle.bind(connector.heartbeat, hyxsocket));
	hyxsocket.on('disconnect', connector.heartbeat.clear.bind(connector.heartbeat, hyxsocket.id));

	connector.emit('connection', hyxsocket);
}
