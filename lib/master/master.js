/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../util/utils'),
	starter = require('./starter'),
	Constants = require('../util/constants');

var Server = function(app, opts){
	var self = this;
	opts = opts || {};

	self.app = app;
	self.masterInfo = app.getMaster();

	opts.port = self.masterInfo.port;
	opts.env = self.app.get(Constants.RESERVED.ENV);
}

module.exports = Server

var pro = Server.prototype

pro.start = function(cb){
	var self = this;
	starter.runServers(self.app);
	utils.invokeCallback(cb);
}

pro.stop = function(cb){
	process.nextTick(cb);
}
