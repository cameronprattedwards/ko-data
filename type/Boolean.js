define(["knockout", "ko-data/type/Type"], function (ko, Type) {
	var Boolean = Type.extend({
		value: false,
		parse: function (input) {
			if (typeof input == "string")
				return input.toLowerCase() === "true" ? true : false;
			else
				return !(!input);
		},
		validate: function (target) {
			if (typeof target() !== "boolean") {
				target.errors.push("type of value must be boolean");
			}
		}
	});

	var output = function (options) {
		return new Boolean(options);
	}

	output.value = false;
	output.getInstance = Boolean.prototype.getInstance;
	output.parse = Boolean.prototype.parse;
	output.serialize = Boolean.prototype.serialize;
	output.validate = Boolean.prototype.validate;

	return output;
});