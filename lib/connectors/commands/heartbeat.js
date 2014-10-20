/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../../util/utils');

var Command = function(opts){
	opts = opts || {};

	this.heartbeat = null;
	this.timeout = null;

	if(opts.heartbeat){
		this.heartbeat = opts.heartbeat * 1000;
		this.timeout = opts.timeout * 1000 || this.heartbeat * 2;
	}

	this.timeouts = {};
	this.clients = {};
}

module.exports = Command;

var pro = Command.prototype;

pro.handler = function(socket){
	if(!this.heartbeat) return;
}

pro.clear = function(id){}
