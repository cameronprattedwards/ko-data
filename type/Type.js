define(["ko-data/object/Object", "knockout", "ko-data/type/dirtyCheck", "ko-data/extenders/validate"], function (Object, ko) {
	var Type = Object.extend({
		init: function (options) {
			for (var x in options) {
				this[x] = options[x];
			}
		},
		getInstance: function () {
			return ko.observable(this.value).extend({ dirtyCheck: true, validate: this.validate });
		},
		parse: function (input) {
			return input;
		},
		serialize: function (value) {
			return value;
		},
		validate: function (target) {
		}
	});

	Type.getInstance = Type.prototype.getInstance;
	Type.parse = Type.prototype.parse;
	Type.serialize = Type.prototype.serialize;
	Type.validate = Type.prototype.validate;

	return Type;
});