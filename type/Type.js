define(["ko-data/object/Object", "knockout", "ko-data/type/dirtyCheck"], function (Object, ko) {
	var Type = Object.extend({
		init: function (options) {
			for (var x in options) {
				this[x] = options[x];
			}
		},
		getInstance: function () {
			return ko.observable(this.value).extend({ dirtyCheck: true });
		},
		parse: function (input) {
			return input;
		},
		serialize: function (value) {
			return value;
		}
	});

	Type.getInstance = Type.prototype.getInstance;
	Type.parse = Type.prototype.parse;

	return Type;
});