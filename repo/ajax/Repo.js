define(["jquery", "ko-data/utils/deferred", "ko-data/object/Object", "ko-data/type/Morpheus", "knockout", "ko-data/utils/stackedPromise"], function ($, deferred, ExtensibleObject, Morpheus, ko, stackedPromise) {
	return ExtensibleObject.extend({
		dataType: "json",
		baseUrl: "",
		entityName: "object",
		pluralEntityName: "objects",
		fileExtension: "",
		entity: Object,
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
				var method = entity.isNew() ? "POST" : "PUT",
					def = deferred(),
					params = {};

				for (var x in entity.properties) {
					params[x] = entity.properties[x].serialize(entity[x]);
				}

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
						_self.staging.splice(_self.staging.indexOf(entity), 1);
						def.resolve();
					},
					error: function (jqXHR, testStatus, errorThrown) {
						def.reject(errorThrown);
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

			$.ajax({
				url: _self.makeUrl(),
				data: params,
				dataType: this.dataType,
				success: function (payload) {
					var parsedData = _self.payloadParser(payload);
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
						grocked.markClean();
						output.push(grocked);
					});

					Morpheus.markDirty = true;
					Morpheus.markNew = true;

					def.resolve(output);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					def.reject(errorThrown);
				},
				type: "GET"
			});

			output.promise = def.promise();
			return output;
		}
	});
});