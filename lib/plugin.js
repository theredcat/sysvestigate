SVPlugin = function(options){
	this.options = options;
	return this;
};

SVPlugin.prototype = {
	get: function(option){
		return this.options[option];
	}
}

module.exports = SVPlugin;
