/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = require('../util/utils')

var Server = function(app, opts){
	this.app = app
}

module.exports = Server

var pro = Server.prototype

pro.start = function(cb){
	utils.invokeCallback(cb)
}

pro.stop = function(cb){

}
