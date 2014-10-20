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
	opts = opts || {};

	this.app = app;
	this.masterInfo = app.getMaster();

	opts.port = this.masterInfo.port;
	opts.env = this.app.get(Constants.RESERVED.ENV);
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
