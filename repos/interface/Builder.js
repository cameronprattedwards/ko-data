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
			return function (input) {
				return input[_self.field]() === comparator;
			};
		}
	}

	return Builder;
});