define(["knockout", "ko-data/type/Type"], function (ko, Type) {
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

	output.getInstance = Dynamic.prototype.getInstance;
	output.parse = Dynamic.prototype.parse;
	output.serialize = Dynamic.prototype.parse;
	output.validate = Dynamic.prototype.validate;

	return output;
});