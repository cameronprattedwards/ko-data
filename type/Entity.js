if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["knockout", "ko-data/type/Type", "ko-data/type/makeTypeStatic"], function (ko, Type, makeTypeStatic) {
	var output = function (T) {
		var EntityType = Type.extend({
			getInstance: function () {
				return ko.observable(new T().valueOf()).extend({ dirtyCheck: true, validate: this.validate });
			},
			parse: function (data) {
				var props = T.prototype.properties,
					setData = {};

				for (var x in data) {
					if (data.hasOwnProperty(x) && props[x])
						try {
							setData[x] = props[x].parse(data[x]);
						} catch (e) {
							throw e;
						}
				}

				return new T(setData);
			},
			serialize: function (input) {
				var output = {},
					props = T.prototype.properties;

				for (var x in props) {
					output[x] = props[x].serialize(input[x]());
				}

				return output;
			},
			validate: function (target) {
				if (!(target() instanceof T)) {
					target.errors.push("value must be instance of generic Entity");
				}
			}
		});

		var output = function (options) {
			return new EntityType(options);
		};

		makeTypeStatic(EntityType, output);

		return output;
	}

	return output;

});