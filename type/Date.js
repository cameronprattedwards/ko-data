define(["knockout", "ko-data/type/Type", "ko-data/type/dirtyCheck"], function (ko, Type) {
	var date = new Date();

	var DateType = Type.extend({
		value: date,
		parse: function (input) {
			return new Date(Date.parse(input));
		},
		getInstance: function () {
			return ko.observable(new Date()).extend({ dirtyCheck: true });
		},
		serialize: function (input) {
			return input.toString();
		}
	});

	var output = function (options) {
		return new DateType(options);
	}

	output.value = date;
	output.getInstance = DateType.prototype.getInstance;
	output.parse = DateType.prototype.parse;

	return output;
});