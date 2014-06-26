define(["knockout", "ko-data/type/Morpheus"], function (ko, Morpheus) {
	ko.extenders.toggle = function (target, option) {
		target.toggle = function () {
			target(!target());
		};

		return target;
	}
});