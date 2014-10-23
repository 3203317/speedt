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

var Socket = function(socket /* raw */, opts){
	var self = this;
	
	if(!(self instanceof Socket)){
		return new Socket(socket /* raw */, opts);
	}

	if(!socket || !opts){
		throw new Error('invalid socket or opts.');
	}

	if(!opts.headSize || typeof opts.headHandler !== 'function'){
		throw new Error('invalid opts.headSize or opts.headHandler');
	}

	Stream.call(self);

	self.readable = !0;
	self.writeable = !0;

	self.socket = socket;
	self.headSize = opts.headSize;
	self.closeMethod = opts.closeMethod;
	self.headBuffer = new Buffer(self.headSize);
	self.headHandler = opts.headHandler;

	self.headOffset = 0;

	self.socket.on('data', ondata.bind(null, self));
	self.socket.on('end', onend.bind(null, self));
	self.socket.on('error', self.emit.bind(self, 'error'));
	self.socket.on('close', self.emit.bind(self, 'close'));

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
	if(!!self.closeMethod && 'end' === self.closeMethod){
		self.socket.end();
		return;
	}

	try{
		self.socket.destroy();
	}catch(ex){
		console.error('[%s] Socket close with destroy error: %j.', utils.format(new Date), ex.stack);
	}
}

function ondata(socket, chunk){
	if(ST_CLOSED === socket.state)
		throw new Error('Socket has closed.');

	if(typeof chunk !== 'string' && !Buffer.isBuffer(chunk)){
		throw new Error('invalid data.');
	}

	if(typeof chunk === 'string'){
		chunk = new Buffer(chunk, 'utf8');
	}

	var offset = 0, end = chunk.length;

	console.log(end)

	return true;
}

function onend(socket, chunk){
	if(chunk) socket.socket.write(chunk);
	socket.state = ST_CLOSED;
	reset(socket);
	socket.emit('end');
}

function reset(socket){
	socket.headOffset = 0;
	socket.packageOffset = 0;
	socket.packageSize = 0;
	socket.packageBuffer = null;
	socket.state = ST_HEAD;
}
