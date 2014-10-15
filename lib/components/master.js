/**
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../util/utils')

module.exports = function(app, opts){
	return new Component(app, opts)
}

var Component = function(app, opts){
	console.log(this.name)
}

var proto = Component.prototype

proto.name = '__master__'

proto.start = function(cb){
	console.log('[%s] Start master.', utils.format(new Date))
}

proto.stop = function(cb){
	// TODO
}
