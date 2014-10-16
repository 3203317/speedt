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

}

var pro = Component.prototype

pro.name = '__master__'

pro.start = function(cb){
	console.log('[%s] Start master.', utils.format(new Date))
}

pro.stop = function(cb){
	// TODO
}
