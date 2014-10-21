/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../../util/utils');

var Command = function(opts){
	var self = this;

	opts = opts || {};

	if(opts.heartbeat){
		self.heartbeat = opts.heartbeat * 1000;
		self.timeout = opts.timeout * 1000 || self.heartbeat * 2;	//max heartbeat message timeout
	}

	self.timeouts = {};
	self.clients = {};
	self.disconnectOnTimeout = opts.disconnectOnTimeout;
}

module.exports = Command;

var pro = Command.prototype;

pro.handle = function(socket){
	var self = this;
	if(!self.heartbeat) return;

	if(!self.clients[socket.id]){
		self.clients[socket.id] = 1;
		socket.once('disconnect', clearTimers.bind(null, self, socket.id));
		socket.once('error', clearTimers.bind(null, self, socket.id));
	}

	if(self.disconnectOnTimeout) self.clear(socket.id);

	socket.sendRaw('heartbeat');

	if(self.disconnectOnTimeout){
		self.timeouts[socket.id] = setTimeout(function(){
			console.log('[%s] Client %j heartbeat timeout.', utils.format(new Date), socket.id);
		}, self.timeout);
	}
}

pro.clear = function(id){
	var tid = this.timeouts[id];
	if(tid){
		clearTimeout(tid);
		delete this.timeouts[id];
	}
}

function clearTimers(self, id){
	delete self.clients[id];
	var tid = self.timeouts[id];
	if(tid){
		clearTimeout(tid);
		delete self.timeouts[id];
	}
}
