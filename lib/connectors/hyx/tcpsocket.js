/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var Stream = require('stream'),
	util = require('util');

var utils = require('../../util/utils');

/**
 * Work states
 */
var ST_HEAD = 1;	// wait for head
var ST_BODY = 2;	// wait for body
var ST_CLOSED = 3;	// closed

var Socket = function(socket, opts){
	var self = this;
	
	if(!(self instanceof Socket)){
		return new Socket(socket, opts);
	}

	self.readable = !0;
	self.writeable = !0;

	self.socket = socket;
	self.closeMethod = opts.closeMethod;

	self.state = ST_HEAD;
}

util.inherits(Socket, Stream);

module.exports = Socket;

var pro = Socket.prototype;

pro.send = function(msg, encode, cb){
	this.socket.write(msg, encode, cb);
};

pro.close = function(){
	var self = this;
	if(!!self.closeMethod && 'end' === self.closeMethod)
		return self.socket.end();

	try{
		self.socket.destroy();
	}catch(ex){
		console.log('[%s] Socket close with destroy error: %j.', utils.format(new Date), ex.stack);
	}
}

function ondata(socket, chunk){
	if(socket.state === ST_CLOSED)
		throw new Error('[%s] Socket has closed.', utils.format(new Date));

	if('string' !== typeof chunk && !Buffer.isBuffer(chunk))
		throw new Error('[%s] Invalid data', utils.format(new Date));

	if('string' === typeof chunk)
		chunk = new Buffer(chunk, 'utf8');
}
