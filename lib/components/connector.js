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
	this.app = app;
	this.connector = getConnector(app, opts);

}

var pro = Component.prototype

pro.name = '__connector__'

pro.start = function(cb){
	console.log('[%s] Connector start.', utils.format(new Date));

	utils.invokeCallback(cb)
}

pro.afterStart = function(cb){
	this.connector.start(cb)
}

pro.stop = function(force, cb){
	process.nextTick(cb);
}


function getConnector(app, opts){
	var connector = opts.connector;
	if(!connector){
		return getDefaultConnector(app, opts);
	}

	if(typeof connector !== 'function'){
		return connector;
	}

	var curServer = app.getCurServer();
	return connector(curServer.clientPort, curServer.host, opts);
};

function getDefaultConnector(app, opts){
	var DefaultConnector = require('../connectors/sioconnector');
	var curServer = app.getCurServer();
	return new DefaultConnector(curServer.clientPort, curServer.host, opts);
};
