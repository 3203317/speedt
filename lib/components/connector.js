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
	var self = this;
	opts = opts || {}
	self.app = app;
	self.connector = getConnector(app, opts);
}

var pro = Component.prototype;

pro.name = '__connector__';

pro.start = function(cb){
	process.nextTick(cb);
}

pro.afterStart = function(cb){
	this.connector.start(cb);
	this.connector.on('connection', hostFilter.bind(this, bindEvents));
}

pro.stop = function(force, cb){
	if(this.connector){
		this.connector.stop(force, cb);
		this.connector = null;
		return;
	}
	process.nextTick(cb);
}

function getConnector(app, opts){
	var connector = opts.connector;

	if(!connector){
		return getDefaultConnector(app, opts);
	}

	if('function' !== typeof connector){
		return connector;
	}

	var curServer = app.getCurServer();
	return connector(curServer, opts);
}

function getDefaultConnector(app, opts){
	var DefaultConnector = require('../connectors/gynconnector');
	var curServer = app.getCurServer();
	return new DefaultConnector(curServer, opts);
}

function hostFilter(cb, socket){
	// TODO
}

function bindEvents(self, socket){
	// TODO
}
