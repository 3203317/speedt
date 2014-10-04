var speedt = require('../../'),
	routeUtil = require('./app/util/routeUtil');

var app = speedt.createApp();
app.set('name', 'uplserv');

app.configure('production|development', function(){
	app.route('upload', routeUtil.upload);
	app.filter(speedt.timeout());
});

app.start();
console.log(speedt)

process.on('uncaughtException', function (err){
	console.error('Caught exception: '+ err.stack);
});