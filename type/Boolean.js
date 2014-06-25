define(["knockout", "./Type.js"], function (ko, Type) {
	var Boolean = Type.extend({
		value: 0,
		parse: function (input) {
			return input.toLowerCase() === "true" ? true : false;
		}
	});

	var output = function (options) {
		return new Boolean(options);
	}

	output.value = false;
	output.getInstance = Boolean.prototype.getInstance;
	output.parse = Boolean.prototype.parse;

	return output;
});