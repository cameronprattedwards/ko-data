define([], function () {
	return {
		once: function (callback) {
			var called = false,
				ret;

			return function () {
				if (!called) {
					called = true;
					ret = callback.apply(this, arguments);
				}

				return ret;
			}
		}
	};
});