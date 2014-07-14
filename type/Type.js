if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["ko-data/object/Object", "knockout", "ko-data/type/dirtyCheck", "ko-data/extenders/validate", "ko-data/type/makeTypeStatic"], function (Object, ko, makeTypeStatic) {
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
		validate: function (target) {},
		mongoSerialize: function () {
			return this.serialize.apply(this, arguments);
		}
	});

	makeTypeStatic(Type, Type);

	return Type;
});