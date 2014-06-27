define(["ko-data/object/Object", "knockout", "io", "ko-data/utils/deferred"], function (ExtensibleObject, ko, io, deferred) {
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
					if (x in data)
						setData[x] = props[x].parse(data[x]);
				}

				var grocked = new _self.entity(setData);
				_self.add(grocked);
				grocked.markClean();

				_self.dataSets.forEach(function (dataSet) {
					if (dataSet.check(grocked))
						dataSet.collection.push(grocked);
				});
			});

			this.socket.on(this.entityName + " updated", function (obj) {
				new _self.entity(obj);
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

				if (entity.isDirty()) {
					_self.socket.emit(_self.entityName + " updated: ", params);
				}

				if (entity.isNew()) {
					_self.socket.emit(_self.entityName + " added", params);
				}
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