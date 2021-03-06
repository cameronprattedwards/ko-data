if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
	function Builder(field) {
		this.field = field;
	}

	Builder.prototype = {
		is: function (comparator) {
			return {
				field: this.field,
				comparator: comparator
			};
		}
	};

	return Builder;
});