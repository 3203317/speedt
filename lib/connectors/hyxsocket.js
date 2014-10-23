/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('util'),
	EventEmitter = require('events').EventEmitter;

var utils = require('../util/utils');

var ST_INITED = 0,
	ST_WAIT_ACK = 1,
	ST_WORKING = 2,
	ST_CLOSED = 3;

var Socket = function(id, socket){
	var self = this;
	EventEmitter.call(self);

	self.id = id;
	self.socket = socket;

	if(socket.socket){
		self.remoteAddress = {
			ip: socket.socket.remoteAddress,
			port: socket.socket.remotePort
		};
	}

	socket.once('close', self.emit.bind(self, 'disconnect'));
	socket.once('error', self.emit.bind(self, 'error'));

	socket.on('message', function (msg){
		if(msg){
			console.log(arguments)
		}
	});

	self.state = ST_INITED;
}

util.inherits(Socket, EventEmitter);

module.exports = Socket;

var pro = Socket.prototype;

pro.sendRaw = function(msg){
	// TODO
}

pro.send = function(msg){
	// TODO
}

pro.sendBatch = function(msgs){
	// TODO
}

pro.disconnect = function(){
	var self = this;
	if(self.state === ST_CLOSED) return;

	self.state = ST_CLOSED;
	self.socket.emit('close');
	self.socket.close();
};
