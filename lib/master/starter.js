/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var os = require('os'),
	util = require('util'),
	cp = require('child_process');

var utils = require('../util/utils'),
	Constants = require('../util/constants')

var starter = module.exports;

starter.runServers = function(app){
	var servers = app.getServersFromConfig();

	for(var serverId in servers){
		this.run(app, servers[serverId]);
	}
};

starter.run = function(app, server, cb){
	var env = app.get(Constants.RESERVED.ENV);

	if(utils.isLocal(server.host)){
		var options = [];
		options.push(app.get(Constants.RESERVED.MAIN));
		options.push(util.format('env=%s', env));

		for(var key in server){
			// TODO
			options.push(util.format('%s=%s', key, server[key]))
		}

		this.localrun(process.execPath, null, options, cb);
	}else{
		// TODO
	}
}

starter.localrun = function(cmd, host, options, cb){
	// console.info('[%s] Executing %s %j locally.', utils.format(new Date), cmd, options);
	spawnProcess(cmd, host, options, cb);
}

function spawnProcess(command, host, options, cb){
	var child = null;

	child = cp.spawn(command, options, {detached: true, stdio: 'inherit'});
	child.unref();

	child.on('exit', function(code){
		if(0 !== code){
			console.error('[%s] Child process exit with error, error code: %s, executed command: %s', utils.format(new Date), code,  command);
		}
		if('function' === typeof cb){
			cb(0 === code ? null : code);
		}
	});
}
