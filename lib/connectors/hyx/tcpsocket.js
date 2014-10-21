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

	if(!socket || !opts){
		throws new Error('invalid socket or opts.');
	}

	if(!opts.headSize || typeof opts.headHandler !== 'function'){
		throw new Error('invalid opts.headSize or opts.headHandler');
	}

	Stream.call(this);

	self.readable = !0;
	self.writeable = !0;

	self.socket = socket;
	self.headSize = opts.headSize;
	self.closeMethod = opts.closeMethod;
	self.headBuffer = new Buffer(self.headSize);
	self.headHandler = opts.headHandler;

	self.headOffset = 0;

	self.socket.on('data', ondata.bind(null, this));
	self.socket.on('end', onend.bind(null, this));
	self.socket.on('error', self.emit.bind(this, 'error'));
	self.socket.on('close', self.emit.bind(this, 'close'));

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
		console.error('[%s] Socket close with destroy error: %j.', utils.format(new Date), ex.stack);
	}
}

function ondata(socket, chunk){
	console.log(arguments)
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
