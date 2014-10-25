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

	if(socket){
		self.remoteAddress = {
			ip: socket.remoteAddress,
			port: socket.remotePort
		};
	}

	socket.once('close', self.emit.bind(self, 'disconnect'));
	socket.on('error', self.emit.bind(self, 'error'));
	socket.on('data', ondata.bind(self));
	socket.on('end', onend.bind(self));

	self.state = ST_INITED;
}

util.inherits(Socket, EventEmitter);

module.exports = Socket;

var pro = Socket.prototype;

function ondata(chunk){
	var self = this;
	// TODO
	self.emit('message', chunk);
}

function onend(chunk){
	var self = this;
	console.log(chunk)
}

pro.disconnect = function(){
	var self = this;
	if(self.state === ST_CLOSED) return;

	self.state = ST_CLOSED;
	self.socket.emit('close');
	self.socket.close();
};
