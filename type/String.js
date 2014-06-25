define(["knockout", "type/Type"], function (ko, Type) {
	var String = Type.extend({
		value: "",
		parse: function (input) {
			return input ? input.toString() : "";
		}
	});

	var output = function (options) {
		return new String(options);
	}

	output.value = "";
	output.getInstance = String.prototype.getInstance;
	output.parse = String.prototype.parse;

	return output;
});