/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('util'),
        EventEmitter = require('events').EventEmitter;

var utils = require('../util/utils');

var ST_INITED = 0;
var ST_WAIT_ACK = 1;
var ST_WORKING = 2;
var ST_CLOSED = 3;

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

	socket.once('close', self.emit.bind(this, 'disconnect'));
	socket.once('error', self.emit.bind(this, 'error'));

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
	var self = this;

	if(self.state !== ST_WORKING) return;

	self.socket.send(msg, {
		binary: true
	}, function (err){
		if(!!err){
			console.log('[%s] Websocket send binary data failed: %j.', utils.format(new Date), err.stack);
			return;
		}
	});
}

pro.send = function(msg){
	if(msg instanceof String){
		msg = new Buffer(msg);
	}else if(!(msg instanceof Buffer)){
		msg = new Buffer(JSON.stringify(msg));
	}
	// TODO
	this.sendRaw(msg);
}

pro.sendBatch = function(msgs){
	var rs = [];
	this.sendRaw(Buffer.concat(rs));
}

pro.disconnect = function(){
	var self = this;
	if(self.state === ST_CLOSED) return;

	self.state = ST_CLOSED;
	self.socket.emit('close');
	self.socket.close();
};
