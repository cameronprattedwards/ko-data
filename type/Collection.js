define(["knockout", "ko-data/type/Type", "ko-data/type/Entity"], function (ko, Type, EntityType) {
	function output(T) {
		var Collection = Type.extend({
			init: function () {
				this._super.apply(this, arguments);
				this.entityType = EntityType(T);
			},
			getInstance: function () {
				return ko.observableArray();
			},
			parse: function (input) {
				var _self = this;

				if (input instanceof Array) {
					return input.map(function (entry) {
						return _self.entityType.parse(entry);
					});
				} else {
					return input;
				}
			},
			serialize: function (input) {
				var _self = this;

				if (input instanceof Array) {
					return input.map(function (entry) {
						return _self.entityType.serialize(entry);
					});
				} else {
					return input;
				}
			}
		});

		function output(options) {
			return new Collection(options);
		};

		output.getInstance = Collection.prototype.getInstance;
		output.parse = Collection.prototype.parse;
		output.serialize = Collection.prototype.serialize;

		return output;
	};

	return output;


});