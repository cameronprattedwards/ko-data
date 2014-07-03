define(["knockout", "ko-data/type/Type"], function (ko, Type) {
	var String = Type.extend({
		value: "",
		parse: function (input) {
			return input ? input.toString() : "";
		},
		validate: function (target) {
			if (typeof target() !== "string") {
				target.errors.push("type of value must be string");
			}
		}
	});

	var output = function (options) {
		return new String(options);
	}

	output.value = "";
	output.getInstance = String.prototype.getInstance;
	output.parse = String.prototype.parse;
	output.serialize = String.prototype.serialize;
	output.validate = String.prototype.validate;

	return output;
});