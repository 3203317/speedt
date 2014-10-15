/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var path = require('path'),
	fs = require('fs')

var Constants = require('./constants'),
	utils = require('./utils');

var exp = module.exports;

/**
 * Initialize application configuration.
 */
exp.defaultConfiguration = function(app){
	var args = parseArgs(process.argv);
	setupEnv(app, args);
	loadMaster(app);
	loadServers(app);
	processArgs(app, args);
	configLogger(app);
	loadLifecycle(app);
}

exp.optComponents = function(comps, method, cb){
	console.log(111222)
	cb(null)
}

exp.startByType = function(app, cb){
	var settings = app.settings
	if(!!settings.startId){
		if(settings.startId === Constants.RESERVED.MASTER){
			utils.invokeCallback(cb)
		}else{
		}
	}else{
		if(!!settings.type){

		}else{
			utils.invokeCallback(cb);
		}
	}
};

exp.loadDefaultComponents = function(app){
	var speedt = require('../speedt')
	var settings = app.settings

	console.log(speedt.master)
	console.log()
	console.log(app.get('connectorConfig'))

	if(settings.serverType === Constants.RESERVED.MASTER){
		app.load(speedt.master, null)
	}else{
		console.log(speedt)
	}
};

function loadLifecycle(app){
	// TODO
}

function configLogger(app){
	// TODO
}

/**
 * Process server start command
 */
function processArgs(app, args){
	var serverType = args.serverType || Constants.RESERVED.MASTER;
	app.set(Constants.RESERVED.SERVER_TYPE, serverType, true);

	var serverId = args.id || app.getMaster().id;
	app.set(Constants.RESERVED.SERVER_ID, serverId, true);

	var mode = args.mode || Constants.RESERVED.CLUSTER;
	app.set(Constants.RESERVED.MODE, mode, true);

	var type = args.type || Constants.RESERVED.ALL;
	app.set(Constants.RESERVED.TYPE, type, true);

	app.set(Constants.RESERVED.MAIN, args.main, true)

	var startId = args.startId;
	if(!!startId) app.set(Constants.RESERVED.STARTID, startId, true)

	if(serverType === Constants.RESERVED.MASTER){
		app.set(Constants.RESERVED.CURRENT_SERVER, app.getMaster(), true)
	}else{
		app.set(Constants.RESERVED.CURRENT_SERVER, args, true)
	}
}

function loadServers(app){
	app.loadConfigBaseApp(Constants.RESERVED.SERVERS, Constants.FILEPATH.SERVER);
	var servers = app.get(Constants.RESERVED.SERVERS);
	var serverMap = {}, slist, server;

	for(var serverType in servers){
		slist = servers[serverType];

		for(var i in slist){
			server = slist[i];
			server.serverType = serverType;

			if(server[Constants.RESERVED.CLUSTER_COUNT]){
				utils.loadCluster(app, server, serverMap);
				continue;
			}

			serverMap[server.id] = server;
		}
	}
	app.set(Constants.KEYWORDS.SERVER_MAP, serverMap);
}

/**
 * Load master info from config/master.json.
 */
function loadMaster(app){
	app.loadConfigBaseApp(Constants.RESERVED.MASTER, Constants.FILEPATH.MASTER)
	console.log('[%s] Master config: %j.', utils.format(new Date), app.get(Constants.RESERVED.MASTER))
}

/**
 * Setup enviroment.
 */
function setupEnv(app, args){
	app.set(Constants.RESERVED.ENV, args.env || Constants.RESERVED.ENV_DEV, !0)
	console.log('[%s] Main App run: %s.', utils.format(new Date), app.get(Constants.RESERVED.ENV))
}

function parseArgs(args){
	var mainPos = 1

	var argsMap = {
		main: args[1]
	}

	for(var i in args){
		if('-' === args[i]){
			mainPos = i - 0
			break
		}
	}

	if(!mainPos) return argsMap

	for(var i = ++mainPos, j = args.length; i < j; i++){
		var arg = args[i]
		var sep = arg.indexOf('=')
		var key = arg.slice(0, sep)
		var value = arg.slice(++sep)

		if(!isNaN(Number(value)) && (value.indexOf('.') < 0)){
			value = Number(value)
		}
		
		argsMap[key] = value
	}

	console.log('[%s] Main App args: %j.', utils.format(new Date), argsMap)

	return argsMap
}
