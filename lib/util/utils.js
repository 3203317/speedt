/*!
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */

var utils = module.exports;

/**
 * Get the count of elements of object
 */
utils.size = function(obj){
	var count = 0;
	for(var i in obj){
		if(obj.hasOwnProperty(i) && typeof 'function' !== obj[i]) count++;
	}
	return count;
};

/**
 * Load cluster server.
 */
utils.loadCluster = function(){
	// TODO
};