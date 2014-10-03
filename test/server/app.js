var speedt = require('../../');

var app = speedt.createApp();
app.set('name', 'uplserv');

app.start();

process.on('uncaughtException', function (err){
	console.error('Caught exception: '+ err.stack);
});