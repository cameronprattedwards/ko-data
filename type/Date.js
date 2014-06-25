define(["knockout", "./Type.js"], function (ko, Type) {
	var DateType = Type.extend({
		value: "",
		parse: function (input) {
			return new Date(Date.parse(input));
		},
		getInstance: function () {
			return ko.observable(new Date());
		}
	});

	var output = function (options) {
		return new DateType(options);
	}

	output.value = new Date();
	output.getInstance = DateType.prototype.getInstance;
	output.parse = DateType.prototype.parse;

	return output;
});