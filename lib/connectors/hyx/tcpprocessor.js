/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var EventEmitter = require('events').EventEmitter,
	util = require('util');

var utils = require('../../util/utils'),
	TcpSocket = require('./tcpsocket');

var ST_STARTED = 1,
	ST_CLOSED = 2;

// private protocol, no need exports
var HEAD_SIZE = 4;

var Processor = function(closeMethod){
	var self = this;
	EventEmitter.call(self);
	self.closeMethod = closeMethod;
	self.state = ST_STARTED;
}

util.inherits(Processor, EventEmitter);

module.exports = Processor;

var pro = Processor.prototype;

pro.add = function(socket, data){
	var self = this;
	if(self.state !== ST_STARTED) return;

	var tcpsocket = new TcpSocket(socket, {
		headSize: HEAD_SIZE,
		headHandler: utils.headHandler,
		closeMethod: self.closeMethod
	});

	// self.emit('connection', tcpsocket);
	socket.emit('data', data);
}

pro.close = function(){
	if(this.state !== ST_STARTED) return;
	this.state = ST_CLOSED;
}