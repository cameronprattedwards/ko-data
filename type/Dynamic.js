define(["knockout", "ko-data/type/Type"], function (ko, Type) {
	var Dynamic = Type.extend({
		getInstance: function () {
			return ko.observable().extend({ dirtyCheck: true });
		},
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

	return output;
});