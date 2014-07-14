if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["knockout", "ko-data/type/Morpheus"], function (ko, Morpheus) {
	ko.extenders.toggle = function (target, option) {
		target.toggle = function () {
			target(!target());
		};

		return target;
	}
});