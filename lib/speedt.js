/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var fs = require('fs'),
	path = require('path')

var application = require('./application')

var SpeedT = module.exports = {
	version: '0.1.0',	// Current version
	components: {},
	filters: {},
	rpcFilters: {},
	connectors: {}
}

var self = this

SpeedT.createApp = function(opts){
	var app = application
	app.init(opts)
	self.app = app
	return app
}

Object.defineProperty(SpeedT, 'app', { get: function(){ return self.app } })
Object.defineProperty(SpeedT.connectors, 'tcpconnector', { get: load.bind(null, './connectors/tcpconnector') })
Object.defineProperty(SpeedT.connectors, 'udpconnector', { get: load.bind(null, './connectors/udpconnector') })

fs.readdirSync(__dirname +'/components').forEach(function (filename){
	if(!/\.js$/.test(filename)) return
	var name = path.basename(filename, '.js')
	var _load = load.bind(null, './components/', name)
	Object.defineProperty(SpeedT, name, { get: _load })
})

fs.readdirSync(__dirname +'/filters/handler').forEach(function (filename){
	if(!/\.js$/.test(filename)) return
	var name = path.basename(filename, '.js')
	var _load = load.bind(null, './filters/handler/', name)
	Object.defineProperty(SpeedT, name, { get: _load })
})

function load(path, name){
	if(!!name) return require(path + name)
	return require(path)
}
