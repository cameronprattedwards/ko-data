define(["../object/Object.js", "knockout"], function (Object, ko) {
	var Type = Object.extend({
		init: function (options) {
			for (var x in options) {
				this[x] = options[x];
			}
		},
		getInstance: function () {
			return ko.observable(this.value);
		},
		parse: function (input) {
			return input;
		}
	});

	Type.getInstance = Type.prototype.getInstance;
	Type.parse = Type.prototype.parse;

	return Type;
});