define([], function () {
	return function (options) {
		for (var x in options) {
			define("ko-data/" + x, [options[x]], function (module) {
				return module;
			});
		}
	};
});