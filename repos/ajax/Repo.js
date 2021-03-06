if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["jquery", 
	"ko-data/utils/deferred", 
	"ko-data/object/Object", 
	"ko-data/type/Morpheus", 
	"knockout", 
	"ko-data/utils/stackedPromise",
	"ko-data/utils/function",
	"ko-data/extenders/map"], function ($, deferred, ExtensibleObject, Morpheus, ko, stackedPromise, f) {
	function DataSet(filters) {
		this.filters = [];
		this.collection = ko.observableArray();
	};

	DataSet.prototype = {
		check: function (entity) {
			return this.collection.indexOf(entity) == -1 && this.filters.every(function (filter) {
				return entity[filter.field]() == filter.comparator;
			});
		},
		checkCollection: function (collection) {
			var _self = this;
			return collection.filter(function (obj) {
				return _self.check(obj);
			});
		}
	};

	var AjaxRepo = ExtensibleObject.extend({
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
			this.graph = {};
			this.dataSets = [];
		},
		payloadParser: function (payload) {
			return payload;
		},
		add: function (entity) {
			if (this.staging.indexOf(entity) == -1)
				this.staging.push(entity);
		},
		makeUrl: function (entity) {
			var ending = this.pluralEntityName + ((entity && !entity.isNew()) ? ("/" + entity[entity.uniqKey]()) : "") + this.fileExtension;

			if (this.belongsTo && entity.parent) {
				var parentId = entity.parent[entity.parent.uniqKey]();
				return this.baseUrl + "/" + this.belongsTo.pluralEntityName + "/" + parentId + "/" + ending;
			} else {
				return this.baseUrl + "/" + ending;
			}
		},
		setRepo: function (prop, x) {
			if (this.has.indexOf(props.entity) !== -1) {
				this.graph[x] = prop;
				for (var i = 0; i < _self.repos.length; i++) {
					var repo = _self.repos[i];

					if (repo.entity === prop.entity) {
						prop.repo = repo;
						return;
					}
				}

				throw new Error("No repository has been created for entity.");
			}
		},
		buildGraph: f.once(function () {
			var props;
			for (var x in (props = this.entity.properties)) {
				this.setRepo(props[x]);
			}
		}),
		save: function (parentId) {
			var entity,
				promises = [],
				_self = this,
				output = deferred();

			this.buildGraph();

			this.staging.forEach(function (entity) {
				if ((!entity.isNew() && !entity.isDirty()))
					return;
				if (!entity.validate())
					return output.reject();

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

						var promises = [];
						for (var x in _self.graph) {
							var rendered = _self[x](),
								repo = _self.graph[x].repo;

							if (rendered instanceof Array) {
								for (var i = 0; i < rendered.length; i++) {
									rendered[i].parent = _self;
									repo.add(rendered[i]);
								}
							} else {
								rendered.parent = _self;
								repo.add(rendered);
							}

							promises.push(repo.save());
						}

						stackedPromise(promises)
							.done(def.resolve)
							.fail(def.reject);
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
			stacked.done(output.resolve);
			stacked.fail(output.reject);
			return output.promise();
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

						parsedData.forEach(function (data, i) {
							var setData = {};
							var props = _self.entity.prototype.properties;
							for (var x in props) {
								if (x in data)
									setData[x] = props[x].parse(data[x]);
							}
							var grocked = new _self.entity(setData);
							_self.add(grocked);
							grocked.markClean();
							if (output()[i] !== grocked) {
								output.remove(grocked);
								output.splice(i, 0, grocked);
							}
							comparer.push(grocked);
						});

						Morpheus.markDirty = true;
						Morpheus.markNew = true;

						gotten = output();

						for (var i = 0; i < gotten.length; i++) {
							if (comparer.indexOf(gotten[i]) == -1 && !gotten[i].isNew()) {
								try {
									delete gotten[i].instances[gotten[i][gotten[i].uniqKey]()];
									output.remove(gotten[i]);
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
				return deferred().reject(new Error("Entity has not yet been persisted.")).promise();

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

	return AjaxRepo;
});

















