if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["ko-data/utils/deferred"], function (deferred) {
	return function (promises) {
		function StackedPromise(promises) {
			var successes = 0,
				failures = 0,
				_self = this,
				args;

			function fire() {
				return failures ? this.reject.apply(this, args) : this.resolve();
			}

			function check() {
				if (successes + failures == promises.length)
					fire.call(this);
			}

			for (var i = 0; i < promises.length; i++) {
				promises[i]
					.done(function () { successes++; })
					.fail(function () { failures++; args = arguments; })
					.always(function () { check.call(_self); });
			}

			//If promises is empty, immediately resolve.
			check.call(this);
		};

		StackedPromise.prototype = deferred();

		return new StackedPromise(promises).promise();
	}
});