define(["jquery", "ko-data/utils/deferred", "ko-data/object/Object", "ko-data/type/Morpheus", "knockout", "ko-data/utils/stackedPromise"], function ($, deferred, ExtensibleObject, Morpheus, ko, stackedPromise) {
	return ExtensibleObject.extend({
		dataType: "json",
		baseUrl: "",
		entityName: "object",
		pluralEntityName: "objects",
		fileExtension: "",
		entity: Object,
		poll: false,
		pollBuffer: 1000,
		init: function () {
			this.staging = [];
		},
		payloadParser: function (payload) {
			return payload;
		},
		add: function (entity) {
			if (this.staging.indexOf(entity) == -1)
				this.staging.push(entity);
		},
		makeUrl: function (entity) {
			return this.baseUrl + "/" + this.pluralEntityName + ((entity && !entity.isNew()) ? ("/" + entity[entity.uniqKey]()) : "") + this.fileExtension;
		},
		save: function () {
			var entity,
				promises = [],
				_self = this;

			this.staging.forEach(function (entity) {
				if (!entity.isNew() && !entity.isDirty())
					return;

				var method = entity.isNew() ? "POST" : "PUT",
					def = deferred(),
					params = {};

				for (var x in entity.properties) {
					if (entity.isNew() || entity[x].isDirty())
						params[x] = entity.properties[x].serialize(entity[x]());
				}

				entity.isLoading(true);

				$.ajax({
					url: _self.makeUrl(entity),
					type: method,
					data: JSON.stringify(params),
					contentType: "application/json",
					success: function (payload) {
						var parsed,
							setData = {};

						try {
							parsed = _self.payloadParser(payload);
						} catch (e) {
							def.reject(e);
							return;
						}

						for (var x in parsed) {
							if (entity.properties[x]) {
								setData[x] = entity.properties[x].parse(parsed[x]);
							}
						}

						Morpheus.markDirty = false;
						entity.set(setData);
						entity.markClean();
						Morpheus.markDirty = true;
						def.resolve();
					},
					error: function (jqXHR, testStatus, errorThrown) {
						def.reject(errorThrown);
					},
					complete: function () {
						entity.isLoading(false);
					}
				});

				promises.push(def.promise());
			});

			var stacked = stackedPromise(promises);
			return stacked;
		},
		where: function () {
			var params = {},
				predicate,
				def = deferred(),
				_self = this,
				output = ko.observableArray();

			for (var i = 0; i < arguments.length; i++) {
				predicate = arguments[i];
				params[predicate.field] = predicate.comparator;
			}

			function request() {
				$.ajax({
					url: _self.makeUrl(),
					data: params,
					dataType: _self.dataType,
					success: function (payload) {
						var parsedData = _self.payloadParser(payload),
							comparer = [],
							gotten;

						Morpheus.markDirty = false;
						Morpheus.markNew = false;

						parsedData.forEach(function (data) {
							var setData = {};
							var props = _self.entity.prototype.properties;
							for (var x in props) {
								if (data[x])
									setData[x] = props[x].parse(data[x]);
							}
							var grocked = new _self.entity(setData);
							_self.add(grocked);
							grocked.markClean();
							output.remove(grocked);
							output.push(grocked);
							comparer.push(grocked);
						});

						Morpheus.markDirty = true;
						Morpheus.markNew = true;

						gotten = output();

						for (var i = 0; i < gotten.length; i++) {
							if (comparer.indexOf(gotten[i]) == -1 && !gotten[i].isNew()) {
								output.remove(gotten[i]);
								try {
									delete gotten[i].instances[gotten[i][gotten[i].uniqKey]()];
								} catch (e) {
									throw e;
								}
							}
						}

						def.resolve(output);

						if (_self.poll)
							window.setTimeout(request, _self.pollBuffer);
					},
					error: function (jqXHR, textStatus, errorThrown) {
						def.reject(errorThrown);
					},
					type: "GET"
				});
			}

			request();

			output.promise = def.promise();
			return output;
		},
		remove: function (entity) {
			var index,
				def,
				_self = this;

			if (entity.isNew())
				return deferred.reject(new Error("Entity has not yet been persisted.")).promise();

			index = this.staging.indexOf(entity);
			def = deferred();

			if (index !== -1)
				this.staging.splice(index, 1);

			entity.isLoading(true);

			$.ajax({
				url: this.makeUrl(entity),
				type: "DELETE",
				dataType: "json",
				success: function (payload) {
					try {
						parsed = _self.payloadParser(payload);
					} catch (e) {
						def.reject(e);
						return;
					}

					delete entity.instances[entity[entity.uniqKey]()];

					def.resolve();
				},
				error: function (jqXHR, textStatus, errorThrown) {
					def.reject(errorThrown);
				},
				complete: function () {
					entity.isLoading(false);
				}
			});

			return def.promise();
		}
	});
});

















