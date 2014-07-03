define(["knockout", "ko-data/type/Type"], function (ko, Type) {
	var output = function (T) {
		var EntityType = Type.extend({
			getInstance: function () {
				return ko.observable(new T().valueOf()).extend({ dirtyCheck: true });
			},
			parse: function (data) {
				var props = T.prototype.properties,
					setData = {};

				for (var x in data) {
					if (props[x])
						setData[x] = props[x].parse(data[x]);
				}

				return new T(setData);
			},
			serialize: function (input) {
				var output = {},
					props = T.prototype.properties;

				for (var x in props) {
					output = props[x].serialize(input[x]());
				}

				return output;
			}
		});

		var output = function (options) {
			return new EntityType(options);
		};

		output.parse = EntityType.prototype.parse;
		output.getInstance = EntityType.prototype.getInstance;
		output.serialize = EntityType.prototype.serialize;

		return output;
	}

	return output;

});