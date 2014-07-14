if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["knockout", "ko-data/type/Type", "ko-data/type/makeTypeStatic"], function (ko, Type, makeTypeStatic) {
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
	makeTypeStatic(Boolean, output);

	return output;
});