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

var ST_INITED = 0;
var ST_WAIT_ACK = 1;
var ST_WORKING = 2;
var ST_CLOSED = 3;

var Socket = function(id, socket){
	var self = this;
	EventEmitter.call(self);

	self.id = id;
	self.socket = socket;

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
