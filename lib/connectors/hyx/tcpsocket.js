/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var Stream = require('stream'),
	util = require('util');

var utils = require('../../../util/utils');

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

	self.readable = true;
	self.writeable = true;
}

util.inherits(Socket, Stream);

module.exports = Socket;

var pro = Socket.prototype;

pro.send = function(msg, encode, cb){
	// TODO
};

pro.close = function(){
	// TODO
}