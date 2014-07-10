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