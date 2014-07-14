if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["knockout", "ko-data/type/Type", "ko-data/type/Entity", "ko-data/entity/Entity", "ko-data/type/makeTypeStatic"], function (ko, Type, EntityType, Entity, makeTypeStatic) {
	function output(T) {
		var Collection = Type.extend({
			init: function () {
				this._super.apply(this, arguments);
				if (T instanceof Entity)
					this.entityType = EntityType(T);
			},
			getInstance: function () {
				return ko.observableArray().extend({ dirtyCheck: true, duckPunch: true, validate: this.validate });
			},
			parse: function (input) {
				var _self = this;

				if (input instanceof Array) {
					return input.map(function (entry) {
						if (_self.entityType)
							return _self.entityType.parse(entry);
						else
							return new T(entry).valueOf();
					});
				} else {
					return input;
				}
			},
			serialize: function (input) {
				var _self = this;

				if (input instanceof Array) {
					return input.map(function (entry) {
						if (_self.entityType)
							return _self.entityType.serialize(entry);
						else
							return new T(entry).valueOf();
					});
				} else {
					return input;
				}
			},
			validate: function (target) {
				for (var i = 0; i < target().length; i++) {
					if (!(target()[i] instanceof T)) {
						target.errors.push("value " + i + " must be an instance of generic Entity");
					}
				}
			}
		});

		function output(options) {
			return new Collection(options);
		};

		makeTypeStatic(Collection, output);

		return output;
	};

	return output;


});