/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var EventEmitter = require('events').EventEmitter,
	util = require('util');

var utils = require('../../util/utils')

var HTTP_METHODS = [
	'GET',
	'POST',
	'DELETE',
	'PUT',
	'HEAD'
];

var ST_STARTED = 1;
var ST_CLOSED = 2;

var DEFAULT_TIMEOUT = 90;

var Switcher = function(server, opts){
	EventEmitter.call(this);
	this.server = server;
	this.timeout = opts.timeout || DEFAULT_TIMEOUT;
	
	this.server.on('connection', this.newSocket.bind(this));
}

util.inherits(Switcher, EventEmitter);

module.exports = Switcher;

var pro = Switcher.prototype;

pro.newSocket = function(socket){
	if(ST_STARTED !== this.state) return;

	var self = this;
}

pro.close = function(){
	if(ST_STARTED !== this.state) return;

	this.state = ST_CLOSED;
}

function isHttp(data){
	var head = data.toString('utf8', 0, 4);

	for(var i=0, j=HTTP_METHODS.length; i<j; i++){
		if(0 === head.indexOf(HTTP_METHODS[i])) return true;
	}

	return false;
}