/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var os = require('os')

var utils = module.exports;

/**
 * Get the count of elements of object
 */
utils.size = function(obj){
	var count = 0;
	for(var i in obj){
		if(obj.hasOwnProperty(i) && 'function' !== typeof obj[i]) count++;
	}
	return count;
};

/**
 * Load cluster server.
 */
utils.loadCluster = function(){
	// TODO
};

utils.invokeCallback = function(cb){
	if(!!cb && 'function' === typeof cb){
		cb.apply(null, Array.prototype.slice.call(arguments, 1));
	}
}

/**
 * @param {String} format 'YY/MM/dd hh:mm:ss.S'
 */
utils.format = function(date, format){
	format = format || 'hh:mm:ss.S'
	var o = {
		'Y+': date.getYear(),
		'M+': date.getMonth() + 1,			// month
		'd+': date.getDate(),				// day
		'h+': date.getHours(),				// hour
		'm+': date.getMinutes(),			// minute
		's+': date.getSeconds(),			// second
		'q+': Math.floor((date.getMonth() + 3) / 3),	// quarter
		'S':  padRight(date.getMilliseconds(), '0', 3)	// millisecond
	}

	if(/(y+)/.test(format)){
		format = format.replace(RegExp.$1, (date.getFullYear() +'').substr(4 - RegExp.$1.length))
	}

	for(var k in o){
		if(new RegExp('('+ k +')').test(format)){
			format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00'+ o[k]).substr((''+ o[k]).length))
		}
	}

	return format
}

utils.isLocal = function(host){
	var app = require('../speedt').app;
	if(!app){
		return host === '127.0.0.1' || host === 'localhost' || inLocal(host);
	}else{
		return host === '127.0.0.1' || host === 'localhost' || inLocal(host) || host === app.master.host;
	}
};

utils.headHandler = function(headBuffer){
	var len = 0;
	for(var i=1; i<4; i++){
		if(1 < i){
			len <<= 8;
		}
		len += headBuffer.readUInt8(i);
	}
	return len;
};

var inLocal = function(host) {
	for(var index in localIps){
		if(host === localIps[index]){
			return true;
		}
	}
	return false;
};

var localIps = function() {
	var ifaces = os.networkInterfaces();
	var ips = [];
	var func = function(details) {
		if(details.family === 'IPv4') {
			ips.push(details.address);
		}
	}
	for (var dev in ifaces) {
		ifaces[dev].forEach(func);
	}
	return ips;
}();

var padRight = utils.padRight = function(str, char, len){
	return (str + Array(len).join(char)).slice(0, len)
}
