var speedt = require('../../');

var app = speedt.createApp();
app.set('name', 'uplserv');

app.configure('production|development', function(){
	app.filter();
});

app.start();

process.on('uncaughtException', function (err){
	console.error('Caught exception: '+ err.stack);
});