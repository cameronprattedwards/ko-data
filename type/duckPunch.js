define(["ko-data/entity/Entity"], function (Entity) {
	var changers = [
		"push",
		"splice",
		"unshift"
	];
	ko.extenders.duckPunch = function (target, option) {
		var push = target.push,
			splice = target.splice,
			unshift = target.unshift;

		target.push = function () {
			var output = push.apply(this, arguments);
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] instanceof Entity)
					arguments[i].parent = this.parent;
			}
			return output;
		};
		target.splice = function (index, length, replacements) {
			var l = length;
			while (l--)
				this()[index].parent = null;

			var output = splice.apply(this, arguments);
			for (var i = 2; i < arguments.length; i++) {
				arguments[i].parent = this.parent;
			}

			return output;
		};
		target.unshift = function () {
			var output = unshift.apply(this, arguments);

			for (var i = 0; i < arguments.length; i++) {
				arguments[i].parent = this.parent;
			}

			return output;
		};

		return target;
	}
});