/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

module.exports.handle = function(socket, reason){
	if('string' === typeof reason){
		var res = {
			reason: reason
		};
		socket.sendRaw();
	}
}
