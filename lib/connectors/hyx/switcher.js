/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var EventEmitter = require('events').EventEmitter,
	util = require('util');

var utils = require('../../util/utils'),
	TCPProcessor = require('./tcpprocessor');

var HTTP_METHODS = [
	'GET',
	'POST',
	'DELETE',
	'PUT',
	'HEAD'
];

var ST_STARTED = 1;
var ST_CLOSED = 2;

var DEFAULT_TIMEOUT = 3;

var Switcher = function(server, opts){
	var self = this;
	EventEmitter.call(self);
	self.server = server;

	self.id = 1;
	self.timers = {};
	self.timeout = opts.timeout || DEFAULT_TIMEOUT;
	self.setNoDelay = opts.setNoDelay;
	self.tcpprocessor = new TCPProcessor(opts.closeMethod);
	
	self.server.on('connection', self.newSocket.bind(self));
	self.tcpprocessor.on('connection', self.emit.bind(self, 'connection'));

	self.state = ST_STARTED;
}

util.inherits(Switcher, EventEmitter);

module.exports = Switcher;

var pro = Switcher.prototype;

pro.newSocket = function(socket){
	var self = this;
	if(ST_STARTED !== self.state) return;

	var timer = setTimeout(function(){
		console.warn('[%s] Socket is timeout, the remote client %s:%s.', utils.format(new Date), socket.remoteAddress, socket.remotePort);
		socket.destroy();
	}, self.timeout * 1000);

	self.timers[self.id] = timer;
	socket.id = self.id++;

	socket.once('data', function (data){
		if(!!socket.id) {
			clearTimeout(self.timers[socket.id]);
			delete self.timers[socket.id];
		}

		socket.setNoDelay(!!self.setNoDelay);
		processTcp(self, self.tcpprocessor, socket, data);
	});
}

pro.close = function(){
	if(ST_STARTED !== this.state) return;

	this.state = ST_CLOSED;
	this.tcpprocessor.close();
}

function isHttp(data){
	var head = data.toString('utf8', 0, 4);

	for(var i=0, j=HTTP_METHODS.length; i<j; i++){
		if(0 === head.indexOf(HTTP_METHODS[i])) return true;
	}

	return false;
}

function processTcp(switcher, processor, socket, data){
	processor.add(socket, data);
}
