define(["knockout", "type/Type"], function (ko, Type) {
	var Number = Type.extend({
		value: 0,
		parse: function (input) {
			return parseFloat(input);
		}
	});

	var output = function (options) {
		return new Number(options);
	}

	output.value = 0;
	output.getInstance = Number.prototype.getInstance;
	output.parse = Number.prototype.parse;

	return output;
});