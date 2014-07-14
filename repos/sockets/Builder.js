if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
	function Builder(field) {
		this.field = field;
	}

	Builder.prototype = {
		is: function (comparator) {
			var _self = this;
			return function (entity) {
				return entity[_self.field] == comparator;
			}
		}
	};
});