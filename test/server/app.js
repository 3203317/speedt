'use strict';

var speedt = require('../../'),
	routeUtil = require('./app/util/routeUtil'),
	utils = require('../../lib/util/utils')

var app = speedt.createApp();
app.set('name', 'uplserv');

app.configure('production|development', function(){
	app.filter(speedt.filters.time())
	app.route('upload', routeUtil.upload);
	app.filter(speedt.filters.timeout());
});

app.start(function (err){
	if(err) console.log(err);
})

//console.log(speedt.app)

process.on('uncaughtException', function (err){
	console.error('Caught exception: %s.', err.stack);
})

process.on('exit', function (code){
	if(0 === code){
		console.log('[%s] Main Process exit.', utils.format(new Date))
		return
	}
	console.error('[%s] Main Process exit with code: %s.', utils.format(new Date), code)
})