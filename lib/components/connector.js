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
	opts = opts || {}
	this.app = app
}

var pro = Component.prototype

pro.name = '__connector__'

pro.start = function(cb){
	console.log('[%s] Connector start.', utils.format(new Date))
	utils.invokeCallback(cb)
}

pro.stop = function(force, cb){

}
