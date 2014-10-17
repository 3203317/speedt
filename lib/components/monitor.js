/**
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../util/utils'),
	Monitor = require('../monitor/monitor')

module.exports = function(app, opts){
	return new Component(app, opts)
}

var Component = function(app, opts){
	this.monitor = new Monitor(app, opts)
}

var pro = Component.prototype

pro.name = '__monitor__'

pro.start = function(cb){
	console.log('[%s] Monitor start.', utils.format(new Date))
	this.monitor.start()
}

pro.stop = function(cb){
	// TODO
}
