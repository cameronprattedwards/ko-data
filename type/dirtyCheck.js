define(["knockout", "ko-data/type/Morpheus"], function (ko, Morpheus) {
	ko.extenders.dirtyCheck = function (target, option) {
		var prevVal = target();
		target.isDirty = ko.observable(false);

		target.subscribe(function (value) {
			if (Morpheus.markDirty && value !== prevVal)
				target.isDirty(true);
			prevVal = value;
		});

		return target;
	}
});