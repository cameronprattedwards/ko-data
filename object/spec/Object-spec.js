define(["object/Object"], function (Object) {
	describe("#extend()", function () {
		//accepts a hash of properties
		var Person = Object.extend({
			speak: function (words) {
				console.log(words);
			},
			jump: function (feet) {
				console.log("I'm jumping " + feet + " in the air.");
			}
		});

		it ("sets the hash on the new object's prototype", function () {
			expect(typeof Person.prototype.speak).toBe("function");
			expect(typeof Person.prototype.jump).toBe("function");
		});

		it ("returns an instance of Object", function () {
			expect(new Person() instanceof Object).toBe(true);
		});

		it ("contains all of the base Object's properties", function () {
			var Woman = Person.extend({
				gender: "female"
			});

			expect(new Woman() instanceof Person).toBe(true);
			expect(typeof Woman.prototype.speak).toBe("function");
		});
	});

	describe("init", function () {
		var called = false;

		var Animal = Object.extend({
			init: function () {
				called = true;
			}
		});

		it ("gets called on instantiation", function () {
			var animal = new Animal();
			expect(called).toBe(true);
		});
	});

	describe("_super", function () {
		var called = false;

		var Person = Object.extend({
			speak: function () {
				called = true;
			}
		});

		var Man = Person.extend({
			speak: function () {
				this._super();
			}
		});

		it("points to the named function on the parent object", function () {
			var cameron = new Man();
			cameron.speak();
			expect(called).toBe(true);
		});
	});
});