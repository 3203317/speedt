/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var fs = require('fs'),
	path = require('path')

var application = require('./application')

var SpeedT = module.exports = {}

/**
 * Current version
 */
SpeedT.version = '0.1.0'

SpeedT.components = {}
SpeedT.filters = {}
SpeedT.rpcFilters = {}
SpeedT.connectors = {}

var self = this

SpeedT.createApp = function(opts){
	var app = application
	app.init(opts)
	self.app = app
	return app
}

Object.defineProperty(SpeedT, 'app', {
	enumerable: true,
	get: function(){
		return self.app
	}
})

Object.defineProperty(SpeedT.connectors, 'tcpconnector', {
	enumerable: !0,
	value: load.bind(null, './connectors/tcpconnector')
})
Object.defineProperty(SpeedT.connectors, 'udpconnector', {
	enumerable: !0,
	value: load.bind(null, './connectors/udpconnector')
})

fs.readdirSync(__dirname +'/components').forEach(function (filename){
	if(!/\.js$/.test(filename)) return
	var name = path.basename(filename, '.js')
	var _load = load.bind(null, './components/', name)
	Object.defineProperty(SpeedT.components, name, {
		enumerable: true,
		value: _load
	})
})

fs.readdirSync(__dirname +'/filters/handler').forEach(function (filename){
	if(!/\.js$/.test(filename)) return
	var name = path.basename(filename, '.js')
	var _load = load.bind(null, './filters/handler/', name)
	Object.defineProperty(SpeedT.filters, name, {
		enumerable: true,
		value: _load
	})
})

function load(path, name){
	if(!!name) return require(path + name)
	return require(path)
}
