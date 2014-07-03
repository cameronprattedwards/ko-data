define(["knockout"], function (ko) {
	ko.extenders.validate = function (target, callback) {
		target.errors = ko.observableArray();

		target.validate = function () {
			target.errors.removeAll();
			callback.call(target, target);
			target.validated(true);
			return target.valid();
		}

		target.validated = ko.observable(false);

		target.valid = ko.computed(function () {
			if (target.validated())
				return target.errors().length == 0;
		});

		return target;
	}
});