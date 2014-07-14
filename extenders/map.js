if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

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
			var args = Array.prototype.slice.call(arguments, 0).map(callback);
			copyPush.apply(copy, args);
		};

		target.push = function () {
			targPush.apply(target, arguments);
			copy.push.apply(copy, arguments);
		};

		targUnshift = target.unshift;
		copyUnshift = copy.unshift;
		copy.unshift = function () {
			var args = Array.prototype.slice.call(arguments, 0).map(callback);
			copyUnshift.apply(target, args);
		};

		target.unshift = function () {
			targUnshift.apply(target, arguments);
			copy.unshift.apply(copy, arguments);
		}

		targSplice = target.splice;
		copySplice = copy.splice;
		copy.splice = function (index, length, replacements) {
			replacements = Array.prototype.slice.call(arguments, 2).map(callback);
			copySplice.apply(copy, [index, length].concat(replacements));
		};

		target.splice = function () {
			targSplice.apply(target, arguments);
			copy.splice.apply(copy, arguments);
		}

		return copy;
	}
});