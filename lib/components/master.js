/**
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../util/utils'),
	Master = require('../master/master')

module.exports = function(app, opts){
	return new Component(app, opts)
}

var Component = function(app, opts){
	this.master = new Master(app, opts)
}

var pro = Component.prototype

pro.name = '__master__'

pro.start = function(cb){
	console.log('[%s] Master start.', utils.format(new Date))
	this.master.start(cb)
}

pro.stop = function(force, cb){
	this.master.stop(cb)
}
