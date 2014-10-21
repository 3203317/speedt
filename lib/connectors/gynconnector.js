/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var Connector = function(port, host, opts){
	var self = this;
	self.opts = opts || {}
}

module.exports = Connector

var pro = Connector.prototype

pro.start = function(cb){
	process.nextTick(cb);
}
