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

console.log(speedt.app)

process.on('uncaughtException', function (err){
	console.error('Caught exception: '+ err.stack);
})

process.on('exit', function(code){
	// do *NOT* do this
	setTimeout(function(){
		console.log('[%s] This will not run.', utils.format(new Date));
	}, 0)
	console.log('[%s] About to exit with code: %s', utils.format(new Date), code);
})
