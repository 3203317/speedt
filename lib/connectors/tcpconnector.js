/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	net = require('net');

var utils = require('../util/utils');

var Connector = function(port, host, opts){
	if(!(this instanceof Connector)){
		return new Connector(port, host, opts);
	}

	EventEmitter.call(this);

	this.opts = opts || {};
	this.port = port;
	this.host = host;
	this.heartbeat = opts.heartbeat;
	this.ssl = opts.ssl;
}

util.inherits(Connector, EventEmitter);

module.exports = Connector;

var pro = Connector.prototype;

pro.start = function(cb){
	this.tcpServer = net.createServer();

	this.sockets = [];

	this.tcpServer.on('error', function (err){
		console.error('[%s] Server error: %j.', utils.format(new Date), err)
	});

	this.tcpServer.on('close', function (err){
		if(err) console.error('[%s] Server error: %j.', utils.format(new Date), err);
		console.log('[%s] Server closed.', utils.format(new Date));
	});

	var self = this;

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
	});
}

pro.stop = function(force, cb){
	process.nextTick(cb)
}
