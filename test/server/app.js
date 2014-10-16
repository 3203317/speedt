'use strict';

var speedt = require('../../'),
	routeUtil = require('./app/util/routeUtil'),
	utils = require('../../lib/util/utils')

var app = speedt.createApp();
app.set('name', 'uplserv');

app.configure('production|development', function(){
	//app.filter(speedt.filters.time())
	//app.route('upload', routeUtil.upload);
	//app.filter(speedt.filters.timeout());
})

app.configure('production|development', 'upload', function(){
	app.set('connectorConfig', {
		connector: speedt.connectors.tcpconnector,
		heartbeat: 3
	})
})

app.start(function (err){
	if(err) console.error('[%s] App err: %s', utils.format(new Date), err.message)
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
