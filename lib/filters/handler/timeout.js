/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
var utils = require('../../util/utils');

var DEFAULT_TIMEOUT = 3000,
	DEFAULT_SIZE = 500;

module.exports = function(timeout, maxSize){
	return new Filter(time || DEFAULT_TIMEOUT, maxSize || DEFAULT_SIZE);
};

var Filter = function(timeout, maxSize){
	this.timeout = timeout;
	this.maxSize = maxSize;
	this.timeouts = {};
	this.curId = 0;
};

Filter.prototype.before = function(msg, session, next){
	var count = utils.size(this.timeouts);
	if(count > this.maxSize){
		console.log('Timeout filter is out of range, current size is %s, max size is %s.', count, this.maxSize);
		return next();
	}
	this.curId++;
	this.timeouts[this.curId] = setTimeout(function(){
		console.log('Request %j timeout.', msg.__route__);
	}, this.timeout);
	session.__timeout__ = this.curId;
	next();
};

Filter.prototype.after = function(err, msg, session, resp, next){
	var timeout = this.timeouts[session.__timeout__];
	if(timeout){
		clearTimeout(timeout);
		delete timeout;
	}
	next(err);
};
