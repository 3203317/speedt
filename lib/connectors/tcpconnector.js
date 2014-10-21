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
	Switcher = require('./hyx/switcher');

var Connector = function(port, host, opts){
	if(!(this instanceof Connector)){
		return new Connector(port, host, opts);
	}

	EventEmitter.call(this);

	this.opts = opts || {};
	this.port = port;
	this.host = host;
	this.heartbeat = new Heartbeat(opts);
	this.ssl = opts.ssl;
}

util.inherits(Connector, EventEmitter);

module.exports = Connector;

var pro = Connector.prototype;

pro.start = function(cb){
	var self = this;

	if(this.ssl){
		// TODO
	}else{
		this.tcpServer = net.createServer();
		//this.switcher = new Switcher(this.tcpServer, self.opts);

		this.sockets = [];

		this.tcpServer.on('error', function (err){
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
		});
	}

	process.nextTick(cb);
}

pro.stop = function(force, cb){
	this.tcpServer.close();
	process.nextTick(cb);
}
