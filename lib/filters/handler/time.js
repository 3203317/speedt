/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
var utils = require('../../util/utils')

module.exports = function(){
	return new Filter()
}

var Filter = function(){}

Filter.prototype.before = function(msg, session, next){
	session.__startTime__ = Date.now()
	next()
}

Filter.prototype.after = function(err, msg, session, resp, next){
	var start = session.__startTime
	if('number' === typeof start){
		var timeUsed = Date.now() - start
		var log = {
			route: msg.__route__,
			args: msg,
			time: utils.format(new Date(start)),
			timeUsed: timeUsed
		}
		console.log(log)
	}
	next(err)
}
