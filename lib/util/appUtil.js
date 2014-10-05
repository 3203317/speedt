/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */

var Constants = require('./constants');

var exp = module.exports;

/**
 * Initialize application configuration.
 */
exp.defaultConfiguration = function(app){
	var args = parseArgs(process.argv);
	setupEnv(app, args);
	loadMaster(app);
	loadServers(app);
};

function loadServers(app){
	app.loadConfigBaseApp(Constants.RESERVED.SERVERS, Constants.FILEPATH.SERVER);
}

/**
 * Load master info from config/master.json.
 */
function loadMaster(app){
	app.loadConfigBaseApp(Constants.RESERVED.MASTER, Constants.FILEPATH.MASTER);
	app.master = app.get(Constants.RESERVED.MASTER);
}

/**
 * Setup enviroment.
 */
function setupEnv(app, args){
	app.set(Constants.RESERVED.ENV, args.env || process.env.NODE_ENV || Constants.RESERVED.ENV_DEV, !0);
}

function parseArgs(args){
	var argsMap = {};
	return argsMap;
}