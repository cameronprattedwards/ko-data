define(["knockout", "ko-data/utils/deferred"], function (ko, deferred) {
	ko.extenders.validate = function (target, callback) {
		target.errors = ko.observableArray();

		target.validate = function () {
			target.errors.removeAll();
			var output = callback.call(target, target) || deferred().resolve(target.valid()).promise();
			target.validated(true);

			return output;
		}

		target.validated = ko.observable(false);

		target.valid = ko.computed(function () {
			if (target.validated())
				return target.errors().length == 0;
		});

		target.notValid = ko.computed(function () {
			return target.valid() === false;
		});

		return target;
	}
});