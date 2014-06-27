define(["ko-data/object/Object", "knockout", "io", "ko-data/utils/deferred", "ko-data/type/Morpheus"], function (ExtensibleObject, ko, io, deferred, Morpheus) {
	function DataSet(filters) {
		this.filters = [];
		this.collection = ko.observableArray();
	};

	DataSet.prototype = {
		check: function (entity) {
			return this.filters.every(function (filter) {
				return filter(entity);
			});
		},
		checkCollection: function (collection) {
			var _self = this;
			return collection.filter(function (obj) {
				return _self.check(obj);
			});
		}
	};


	return ExtensibleObject.extend({
		addVerb: "added",
		removeVerb: "removed",
		entityName: "object",
		entityPluralName: "objects",
		url: "",
		entity: Object,
		init: function () {
			var _self = this;
			this.staging = [];
			this.dataSets = [];
			this.socket = io();
			this.socket.on(this.entityName + " added", function (obj) {
				var setData = {},
					props = _self.entity.prototype.properties,
					fits = true;
				
				for (var x in props) {
					if (x in obj)
						setData[x] = props[x].parse(obj[x]);
				}

				Morpheus.markDirty = false;
				var grocked = new _self.entity(setData);
				Morpheus.markDirty = true;
				_self.add(grocked);
				grocked.markClean();

				_self.dataSets.forEach(function (dataSet) {
					if (dataSet.check(grocked) && dataSet.indexOf(grocked) == -1)
						dataSet.collection.push(grocked);
				});
			});

			this.socket.on(this.entityName + " updated", function (obj) {
				var props = _self.entity.prototype.properties;
				for (var x in obj) {
					if (props[x])
						obj[x] = props[x].parse(obj[x]);
				}
				Morpheus.markDirty = false;
				var entity = new _self.entity(obj);
				entity.markClean();
				Morpheus.markDirty = true;
			});

			this.socket.on(this.entityName + " removed", function (id) {
				var entity = _self.entity.instances[id];

				_self.dataSets.forEach(function (dataSet) {
					dataSet.collection.remove(entity);
				});

				delete _self.entity.instances[id];
			});
		},
		add: function (entity) {
			if (this.staging.indexOf(entity) == -1)
				this.staging.push(entity);
		},
		save: function () {
			var _self = this;

			this.staging.forEach(function (entity) {
				if (!entity.isNew() && !entity.isDirty())
					return;

				var params = {};
				for (var x in entity.properties) {
					if (entity.isNew() || entity[x].isDirty() || x == entity.uniqKey)
						params[x] = entity.properties[x].serialize(entity[x]());
				}

				if (entity.isNew()) {
					_self.socket.emit(_self.entityName + " added", params);
				} else if (entity.isDirty()) {
					_self.socket.emit(_self.entityName + " updated", params);
				}

				entity.markClean();
			});

			return deferred().resolve().promise();
		},
		remove: function (entity) {
			if (entity.isNew())
				return deferred.reject(new Error("Entity has not yet been persisted.")).promise();

			index = this.staging.indexOf(entity);
			def = deferred();

			if (index !== -1)
				this.staging.splice(index, 1);

			var id = entity[entity.uniqKey]();
			this.socket.emit(this.entityName + " removed", id);
			delete entity.instances[id];
			this.dataSets.forEach(function (dataSet) {
				dataSet.collection.remove(entity);
			});

			return deferred().resolve().promise();
		},
		where: function () {
			var toFilter = this.staging.slice(0),
				_self = this,
				filters = Array.prototype.slice.call(arguments, 0),
				dataSet = new DataSet(filters);

			dataSet.collection(dataSet.checkCollection(this.staging.slice(0)));
			this.dataSets.push(dataSet);

			return dataSet.collection;
		}
	});
});