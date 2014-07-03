define(["knockout"], function (ko) {
	ko.extenders.validate = function (target, callback) {
		target.errors = ko.observableArray();

		target.validate = function () {
			target.errors.removeAll();
			callback.call(target, target);
			return target.valid();
		}

		target.valid = ko.computed(function () {
			return target.errors().length == 0;
		});

		return target;
	}
});