define(["knockout", "ko-data/type/Type", "ko-data/type/makeTypeStatic"], function (ko, Type, makeTypeStatic) {
	var Dynamic = Type.extend({
		parse: function (input) {
			return input;
		},
		serialize: function (input) {
			return input;
		}
	});

	var output = function (options) {
		return new Dynamic(options);
	}

	makeTypeStatic(Dynamic, output);

	return output;
});