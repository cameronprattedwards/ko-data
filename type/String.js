if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["knockout", "ko-data/type/Type", "ko-data/type/makeTypeStatic"], function (ko, Type, makeTypeStatic) {
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
	makeTypeStatic(String, output);

	return output;
});