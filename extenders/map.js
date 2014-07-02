define(["knockout"], function (ko) {
	ko.extenders.map = function (target, callback) {
		var coll = target(),
			targPush,
			targUnshift,
			targSplice,
			copyPush,
			copyUnshift,
			copySplice,
			copy = ko.observableArray(coll.slice(0));

		copy.splice.apply(copy, [0, coll.length].concat(coll.map(callback)));

		targPush = target.push;
		copyPush = copy.push;
		copy.push = function () {
			targPush.apply(target, arguments);
			var args = Array.prototype.slice.call(arguments, 0).map(callback);
			copyPush.apply(copy, args);
		};

		targUnshift = target.unshift;
		copyUnshift = copy.unshift;
		copy.unshift = function () {
			targUnshift.apply(target, arguments);
			var args = Array.prototype.slice.call(arguments, 0).map(callback);
			copyUnshift.apply(target, args);
		};

		targSplice = target.splice;
		copySplice = copy.splice;
		copy.splice = function (index, length, replacements) {
			targSplice.apply(target, arguments);
			replacements = Array.prototype.slice.call(arguments, 2).map(callback);
			copySplice.apply(copy, [index, length].concat(replacements));
		};

		return copy;
	}
});