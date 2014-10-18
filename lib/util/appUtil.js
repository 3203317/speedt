/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var path = require('path'),
	fs = require('fs'),
	async = require('async')

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
	async.forEachSeries(comps, function (comp, done){
		if('function' === typeof comp[method]){
			return comp[method](done)
		}
		done()
	}, function (err){
		if(err){
			console.error('[%s] Operate component fail, method: %s, err: %j.', utils.format(new Date), method, err)
		}
		utils.invokeCallback(cb, err)
	})
}

exp.startByType = function(app, cb){
	var settings = app.settings
	if(settings.serverType === Constants.RESERVED.MASTER){
		return utils.invokeCallback(cb)
	}else{
		utils.invokeCallback(cb)
	}
}

exp.loadDefaultComponents = function(app){
	var speedt = require('../speedt')
	var settings = app.settings

	if(settings.serverType === Constants.RESERVED.MASTER){
		app.load(speedt.master, app.get('masterConfig'))
	}else{
		app.load(speedt.connector, app.get('connectorConfig'))
	}

	app.load(speedt.monitor, app.get('monitorConfig'))
}

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
	var serverType = args.serverType || Constants.RESERVED.MASTER
	var mode = args.mode || Constants.RESERVED.CLUSTER
	var type = args.type || Constants.RESERVED.ALL

	app.set(Constants.RESERVED.MAIN, args.main, true)
	app.set(Constants.RESERVED.SERVER_TYPE, serverType, true)
	app.set(Constants.RESERVED.MODE, mode, true)
	app.set(Constants.RESERVED.TYPE, type, true)

	if(serverType === Constants.RESERVED.MASTER){
		app.set(Constants.RESERVED.CURRENT_SERVER, app.getMaster(), true)
	}else{
		app.set(Constants.RESERVED.CURRENT_SERVER, args, true)
	}

	var curServer = app.get(Constants.RESERVED.CURRENT_SERVER)
        app.set(Constants.RESERVED.STARTID, curServer.id, true)

	console.log('[%s] Config main: %s.', utils.format(new Date), app.get(Constants.RESERVED.MAIN))
	console.log('[%s] Config serverType: %s.', utils.format(new Date), app.get(Constants.RESERVED.SERVER_TYPE))
	console.log('[%s] Config mode: %s.', utils.format(new Date), app.get(Constants.RESERVED.MODE))
	console.log('[%s] Config type: %s.', utils.format(new Date), app.get(Constants.RESERVED.TYPE))
	console.log('[%s] Config startId: %s.', utils.format(new Date), app.get(Constants.RESERVED.STARTID))
	console.log('[%s] Config curServer: %j.', utils.format(new Date), app.get(Constants.RESERVED.CURRENT_SERVER))
}

function loadServers(app){
	app.loadConfigBaseApp(Constants.RESERVED.SERVERS, Constants.FILEPATH.SERVER)
	var servers = app.get(Constants.RESERVED.SERVERS)
	console.log('[%s] Server config: %j.', utils.format(new Date), app.get(Constants.RESERVED.SERVERS))

	var serverMap = {}, slist, server

	for(var serverType in servers){
		slist = servers[serverType]

		for(var i in slist){
			server = slist[i]
			server.serverType = serverType
			serverMap[server.id] = server
		}
	}
	app.set(Constants.KEYWORDS.SERVER_MAP, serverMap)
	console.log('[%s] ServerMap config: %j.', utils.format(new Date), app.get(Constants.KEYWORDS.SERVER_MAP))
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

	if(1 === mainPos){
		console.log('[%s] Main App args: %j.', utils.format(new Date), argsMap)
		return argsMap
	}

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
