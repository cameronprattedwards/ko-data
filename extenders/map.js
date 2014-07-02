define(["knockout"], function (ko) {
	ko.extenders.map = function (target, callback) {
		var coll = target(),
			push,
			unshift,
			splice;

		target.splice.apply(target, [0, target.length].concat(coll.map(callback)));

		push = target.push;
		target.push = function () {
			var args = Array.prototype.slice.call(arguments, 0).map(callback);
			push.apply(target, args);
		};

		unshift = target.unshift;
		target.unshift = function () {
			var args = Array.prototype.slice.call(arguments, 0).map(callback);
			unshift.apply(target, args);
		};

		splice = target.splice;
		target.splice = function (index, length, replacements) {
			replacements = Array.prototype.slice.call(arguments, 2).map(callback);
			splice.apply(target, [index, length].concat(replacements));
		};

		return target;
	}
});