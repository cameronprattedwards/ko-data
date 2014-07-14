define(["ko-data/object/Object", "knockout", "mongojs", "ko-data/utils/deferred", "ko-data/type/Morpheus"], function (ExtensibleObject, ko, mongojs, deferred, Morpheus) {
	var Repo = ExtensibleObject.extend({
		entityName: "object",
		pluralEntityName: "objects",
		dbUrl: "test",
		collections: [],
		entity: Object,
		connection: [],
		init: function () {
			if (!this.connection.length)
				this.connection.push(mongojs.connect(this.dbUrl, this.collections));
			this.staging = ko.observableArray();
		},
		where: function () {
			var predicate = {},
				output = ko.observableArray(),
				_self = this,
				def = deferred();

			output.promise = def.promise();

			output.use = function (callback) {
				this.useCallback = callback;
			};

			Array.prototype.slice.call(arguments, 0).forEach(function (where) {
				if (where.field === _self.entity.prototype.uniqKey)
					return predicate["_id"] = mongojs.ObjectId(where.comparator);

				predicate[where.field] = where.comparator;
			});

			this.connection.find(predicate, function (err, results) {
				var proto = _self.entity.prototype;

				if (err)
					return output.reject(err);

				if (output.useCallback)
					var newOnes = results.filter(function (raw) {
						return !proto.instances[raw[uniqKey]];
					});

				Morpheus.markDirty = false;
				Morpheus.markNew = false;

				var mapped = results.map(function (data) {
					var setData = {};
					var props = _self.entity.prototype.properties;
					for (var x in props) {
						if (x in data)
							setData[x] = props[x].parse(data[x]);
					}
					var grocked = new _self.entity(setData);
					_self.add(grocked);
					grocked.markClean();

					return grocked;
				});

				Morpheus.markDirty = true;
				Morpheus.marknew = true;

				output.push.apply(output, mapped);

				if (output.useCallback) {
					var useResult = output.useCallback(Array.prototype.slice.call(output(), 0));
					function clean() {
						newOnes.forEach(function (newOne) {
							var id = newOne[proto.uniqKey],
								entity = proto.instances[id];

							delete proto.instances[id];
							output.remove(entity);
							_self.staging.remove(entity);
						});
					};

					if (useResult.always)
						useResult.always(clean);
					else
						clean();
				}
			});

			return output;
		},
		add: function (entity) {
			if (this.staging.indexOf(entity) == -1)
				this.staging.push(entity);
		},
		save: function () {
			var _self = this,
				promises = [];

			this.staging().forEach(function (entity) {
				if (entity.isNew()) {
					var raw = {},
						def = deferred();

					promises.push(def.promise());

					for (var x in entity.properties) {
						if (x !== entity.uniqKey)
							raw[x] = entity.properties[x].mongoSerialize(entity[x]());
					}

					_self.connection.save(raw, function (err, saved) {
						if (err)
							return def.reject(err);
						Morpheus.markDirty = false;
						entity.set(saved);
						entity.markClean();
						Morpheus.markDirty = true;
						def.resolve();
					});
				} else if (entity.isDirty()) {
					var raw = {},
						def = deferred();

					promises.push(def.promise());

					for (var x in entity.properties) {
						if (entity[x].isDirty() && x !== entity.uniqKey)
							raw[x] = entity.properties[x].mongoSerialize(entity[x]());
					}

					_self.connection.update({ _id: mongojs.ObjectId(entity[entity.uniqKey]()) }, raw, function (err, saved) {
						if (err)
							return def.reject(err);

						Morpheus.markDirty = false;
						entity.set(saved);
						entity.markClean();
						Morpheus.markDirty = true;
						def.resolve();
					});
				}
			});

			return stackedPromise(promises);
		},
		remove: function (entity) {
			var output = deferred(),
				_self = this;

			this.collection.remove({ _id: mongojs.ObjectId(entity[entity.uniqKey]()) }, true, function (err, data) {
				if (err)
					return output.reject(err);

				_self.staging.remove(entity);
				delete _self.entity.instances[entity[entity.uniqKey]()];
				output.resolve();
			});

			return output.promise();
		}
	});

	var extend = Repo.extend;

	Repo.extend = function (props) {
		var colls = this.prototype.collections;

		if (props.pluralEntityName)
			colls.push(props.pluralEntityName)
		else if (colls.indexOf("objects") == -1)
			colls.push("objects");

		return extend.apply(this, arguments);
	}

	return Repo;
});