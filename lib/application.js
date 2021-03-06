/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var path = require('path'),
	fs = require('fs'),
	EventEmitter = require('events').EventEmitter;

var Constants = require('./util/constants'),
	appUtil = require('./util/appUtil'),
	events = require('./util/events'),
	utils = require('./util/utils');

var Application = module.exports = {};

/**
 * Application states
 */
var STATE_INITED  = 1;	// app has inited
var STATE_START   = 2;	// app start
var STATE_STARTED = 3;	// app has started
var STATE_STOPED  = 4;	// app has stoped

/**
 * app init
 */
Application.init = function(opts){
	opts = opts || {};

	this.loaded = []			// loaded component list
	this.settings = {}			// collection keep set/get
	this.components = {}
	this.event = new EventEmitter()		// event object to sub/pub events

	var base = opts.base || path.dirname(require.main.filename)
	this.set(Constants.RESERVED.BASE, base, true)

	appUtil.defaultConfiguration(this)

	this.state = STATE_INITED;
	console.log('[%s] App inited: %s.', utils.format(new Date), this.getServerId())
}

Application.configure = function(env, type, fn){
	var args = [].slice.call(arguments)
	fn = args.pop()
	env = type = Constants.RESERVED.ALL

	if(0 < args.length) env = args[0]
	if(1 < args.length) type = args[1]

	if(env === Constants.RESERVED.ALL || contains(this.settings.env, env)){
		if(type === Constants.RESERVED.ALL || contains(this.settings.serverType, type)){
			fn.call(this)
		}
	}

	return this
}

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
		utils.invokeCallback(cb, new Error('App has already start.'));
		return;
	}

	var self = this;

	appUtil.startByType(self, function(){
		appUtil.loadDefaultComponents(self);
		var startUp = function(){
			appUtil.optComponents(self.loaded, Constants.RESERVED.START, function (err){
				if(err){
					utils.invokeCallback(cb, err);
					return;
				}

				self.state = STATE_START;
				// console.log('[%s] App startUp.', utils.format(new Date));
				self.afterStart(cb);
			})
		}

		var beforeFun = null

		if(!beforeFun){
			startUp()
		}
	})
}

Application.afterStart = function(cb){
	if(this.state !== STATE_START){
		utils.invokeCallback(cb, new Error('App is not running now.'));
		return;
	}

	var self = this;

	appUtil.optComponents(self.loaded, Constants.RESERVED.AFTER_START, function (err){
		if(err){
			utils.invokeCallback(cb, err);
			return;
		}

		self.state = STATE_STARTED
		var id = self.getServerId()
		var usedTime = Date.now() - self.startTime;
		console.info('[%s] %j startup in %s ms.', utils.format(new Date), id, usedTime);

		self.event.emit(events.START_SERVER, id);
	})
}

Application.load = function(name, component, opts){
	if('string' !== typeof name){
		opts = component
		component = name
		name = null
	}

	if('function' === typeof component){
		component = component(this, opts)
	}

	if(!name && 'string' === typeof component.name){
		name = component.name
	}

	if(!!name && this.components[name]){
		// console.warn('[%s] Ignore duplicate component: %j.', name)
		return;
	}

	this.loaded.push(component)

	if(!!name) this.components[name] = component

	return this
}

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
	return this.get(Constants.RESERVED.STARTID)
};

Application.getBase = function(){
	return this.get(Constants.RESERVED.BASE);
};

Application.loadConfigBaseApp = function(key, val){
	var env = this.get(Constants.RESERVED.ENV);

	var originPath = path.join(Application.getBase(), val);
	var presentPath = path.join(Application.getBase(), Constants.FILEPATH.CONFIG_DIR, env, path.basename(val));

	if(fs.existsSync(originPath)){
		var file = require(originPath);
		if(file[env]) file = file[env];
		this.set(key, file);
	} else if(fs.existsSync(presentPath)){
		this.set(key, require(presentPath));
	} else {
		console.warn('[%s] Invalid configuration with file path: %s.', utils.format(new Date), key)
	}
};

Application.getMaster = function(){
	return this.get(Constants.RESERVED.MASTER)
};

Application.getServersFromConfig = function(){
	return this.get(Constants.KEYWORDS.SERVER_MAP);
};

Application.getCurServer = function(){
	return this.get(Constants.RESERVED.CURRENT_SERVER)
};

function addFilter(app, type, filter){
	var filters = app.get(type);
	if(!filters){
		filters = [];
		app.set(type, filters);
	}
	filters.push(filter);
}

function contains(str, settings){
	if(!settings) return false

	var ts = settings.split('|')

	for(var i in ts){
		if(str === ts[i]) return true
	}

	return false
}
