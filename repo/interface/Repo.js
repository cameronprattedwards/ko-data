define(["ko-data/object/Object", "ko-data/utils/deferred"], function (Object, deferred) {
	return Object.extend({
		init: function () {
			this.instances = [];
			this.staging = [];
		},
		add: function (instance) {
			this.staging.push(instance);
		},
		save: function () {
			Array.prototype.push.apply(this.instances, this.staging);
			this.staging.splice(0);
			return deferred().promise();
		},
		where: function () {
			var output = this.instances.slice(0),
				pred;

			for (var i = 0; i < arguments.length; i++) {
				pred = arguments[i];
				output = output.filter(pred);
			}

			return deferred().resolve(output).promise();
		},
		entity: Object
	});
});