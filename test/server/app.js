/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var speedt = require('../../'),
	utils = require('../../lib/util/utils'),
	dataFilter = require('./app/servers/connector/filter/dataFilter')

var app = speedt.createApp();
app.set('name', 'uplserv');

app.configure('production|development', function(){
	app.filter(speedt.time())
	app.filter(speedt.timeout())
})

app.configure('production|development', 'connector', function(){
	app.filter(dataFilter())

	app.set('connectorConfig', {
		connector: speedt.connectors.tcpconnector,
		heartbeat: 3
	})
})

app.start(function (err){
	if(err) console.error('[%s] App start error: %j', utils.format(new Date), err)
})

//console.log(speedt.app)

process.on('uncaughtException', function (err){
	console.error('[%s] Caught exception: %j.', utils.format(new Date), err.stack)
})

process.on('exit', function (code){
	if(0 === code){
		console.log('[%s] Main Process exit.', utils.format(new Date))
		return
	}
	console.error('[%s] Main Process exit with code: %s.', utils.format(new Date), code)
})
