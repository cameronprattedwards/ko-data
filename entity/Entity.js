define(["knockout", "type/Morpheus"], function (ko, Morpheus) {
	/* Simple JavaScript Inheritance
	* By John Resig http://ejohn.org/
	* MIT Licensed.
	*/
	// Inspired by base2 and Prototype
	var initializing = false, 
		fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

	// The base Entity implementation (does nothing)
	var Entity = function () {};

	Entity.prototype = {
		properties: {},
		init: function (hash) {
			Morpheus.markDirty = false;
			for (var x in this.properties) {
				this[x] = this.properties[x].getInstance();
			}

			for (var x in hash) {
				if (this.properties[x]) {
					this[x](hash[x]);
				} else {
					this[x] = ko.observable(hash[x]);
				}
			}

			this.isLoading = ko.observable(false);
			this.isDirty = ko.observable(false);
			this.isNew = ko.observable(true);
			Morpheus.markDirty = true;
		}
	};

	// Create a new Entity that inherits from this entity
	Entity.extend = function(prop) {
		var _super = this.prototype;

		// Instantiate a base entity (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		prototype.properties = Object.create(prototype.properties);
		initializing = false;

		// Copy the properties over onto the new prototype
		for (var name in prop) {
			if (prop[name].getInstance) {
				prototype.properties[name] = prop[name];
				continue;
			}

			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function" &&
				typeof _super[name] == "function" && 
				fnTest.test(prop[name]) ?
					(function(name, fn){
						return function() {
							var tmp = this._super;

							// Add a new ._super() method that is the same method
							// but on the super-entity
							this._super = _super[name];

							// The method only need to be bound temporarily, so we
							// remove it when we're done executing
							var ret = fn.apply(this, arguments);        
							this._super = tmp;

							return ret;
						};
					})(name, prop[name]) :
					prop[name];
		}

		// The dummy entity constructor
		function Entity() {
			// All construction is actually done in the init method
			if ( !initializing )
				this.init.apply(this, arguments);
		}

		// Populate our constructed prototype object
		Entity.prototype = prototype;

		// Enforce the constructor to be what we expect
		Entity.prototype.constructor = Entity;

		// And make this entity extendable
		Entity.extend = arguments.callee;

		return Entity;
	};

	return Entity;
});
