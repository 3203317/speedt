/**
 * SpeedT
 * Copyright(c) 2014 huangxin <3203317@qq.com>
 * MIT Licensed
 */
module.exports = function(app, opts){
	return new Component(app, opts)
}

var Component = function(app, opts){

}

var proto = Component.prototype

proto.name = '__master__'

proto.start = function(cb){
	// TODO
}

proto.stop = function(cb){
	// TODO
}
