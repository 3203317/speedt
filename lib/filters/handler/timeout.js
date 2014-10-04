var DEFAULT_TIMEOUT = 3000,
	DEFAULT_SIZE = 500;

module.exports = function(timeout, maxSize){
	return new Filter(time || DEFAULT_TIMEOUT, maxSize || DEFAULT_SIZE);
};

var Filter = function(timeout, maxSize){
	this.timeout = timeout;
	this.maxSize = maxSize;
};

Filter.prototype.before = function(msg, session, next){
	next();
};

Filter.prototype.after = function(msg, session, next){
	next();
};