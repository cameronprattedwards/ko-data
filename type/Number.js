define(["knockout", "ko-data/type/Type", "ko-data/type/makeTypeStatic"], function (ko, Type, makeTypeStatic) {
	var Number = Type.extend({
		value: 0,
		parse: function (input) {
			return typeof input == "number" ? input : parseFloat(input);
		},
		validate: function (target) {
			if (typeof target() !== "number") {
				var attempt = parseFloat(target());

				if (!isNaN(attempt)) {
					target(attempt);
					return;
				}

				target.errors.push("type of value must be number");
			}
		}
	});

	var output = function (options) {
		return new Number(options);
	}

	output.value = 0;

	makeTypeStatic(Number, output);
	
	return output;
});