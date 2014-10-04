/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */

var Constants = require('./util/constants'),
	appUtil = require('./util/appUtil');

var Application = module.exports = {};

/**
 * Application states
 */
var STATE_INITED  = 1;	// app has inited
var STATE_START = 2;	// app start
var STATE_STARTED = 3;	// app has started
var STATE_STOPED  = 4;	// app has stoped

/**
 * app init
 */
Application.init = function(opts){
	opts = opts || {};
	this.settings = {};

	appUtil.defaultConfiguration(this);

	this.state = STATE_INITED;
	console.log('application inited: '+ this.getServerId());
};

Application.configure = function(env, type, fn){
	var args = [].slice.call(arguments);
	fn = args.pop();

	return this;
};

Application.set = function(key, val){
	this.settings[key] = val;
	return this;
};

/**
 * Get property from key
 *
 * @param {String} key
 * @return {String} val
 * @memberOf Application
 */
Application.get = function(key){
	return this.settings[key];
};

/**
 * Start application. It would load the default components and start all the loaded components.
 *
 * @param  {Function} cb callback function
 * @memberOf Application
 */
Application.start = function(cb){
	this.startTime = Date.now();
	if(this.state > STATE_INITED){
		return;
	}
};

Application.before = function(filter){
	addFilter(this, Constants.KEYWORDS.BEFORE_FILTER, filter);
};

Application.filter = function(filter){
	this.before(filter);
	this.after(filter);
	return this;
};

Application.after = function(filter){
	addFilter(this, Constants.KEYWORDS.AFTER_FILTER, filter);
};

Application.route = function(serverType, routeFunc){
	var routes = this.get(Constants.KEYWORDS.ROUTE);
	if(!routes){
		routes = {};
		this.set(Constants.KEYWORDS.ROUTE, routes);
	}
	routes[serverType] = routeFunc;
	return this;
};

Application.getServerId = function(){
	return this.serverId;
};

function addFilter(app, type, filter){
	var filters = app.get(type);
	if(!filters){
		filters = [];
		app.set(type, filters);
	}
	filters.push(filter);
}