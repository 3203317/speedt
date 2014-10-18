/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

module.exports = function(){
	return new Filter()
}

var Filter = function(){
	// TODO
}

var pro = Filter.prototype

pro.before = function(msg, session, next){
	console.log('[%s] msg: %j.', utils.format(new Date), msg)
	next()
}

pro.after = function(err, msg, session, resp, next){
	next(err)
}
