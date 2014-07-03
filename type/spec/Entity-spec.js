define(["ko-data/entity/Entity", "ko-data/type/Entity", "ko-data/type/String", "ko-data/type/Number", "knockout"], function (Entity, EntityType, String, Number, ko) {
	describe("Entity", function () {
		var Person = Entity.extend({
			name: String,
			id: Number
		});

		var entType = EntityType(Person);

		describe("#getInstance", function () {
			describe("return value", function () {
				it("has a .errors array", function () {
					var instance = entType.getInstance();
					expect(ko.isObservable(instance.errors)).toBe(true);
					expect(instance.errors() instanceof Array).toBe(true);
				});

				describe("#validate()", function () {
					var instance = entType.getInstance();

					it("recognizes a non-Entity value", function () {
						instance(false);
						expect(instance.validate()).toBe(false);

						instance(new Person());
						expect(instance.validate()).toBe(true);
					});

					it("adds errors to .errors", function () {
						instance(20);
						instance.validate();
						expect(instance.errors().length).toBe(1);
						expect(instance.errors()[0]).toBe("value must be instance of generic Entity");

						instance(new Person());
						instance.validate();
						expect(instance.errors().length).toBe(0);
					});					
				});
			});
		});

		describe("#parse", function () {
			var obj = { name: "Jedediah", id: 1 },
				output = entType.parse(obj);

			it("returns an Entity", function () {
				expect(output instanceof Person).toBe(true);
			});

			it("sets all properties correctly", function () {
				expect(output.name()).toBe("Jedediah");
			});
		});

		describe("#serialize", function () {
			var person = new Person({ name: "Cameron", id: 2 }),
				output = entType.serialize(person);

			it("returns a plain old JS object", function () {
				expect(output.constructor).toBe(Object);
			});

			it("sets all properties on the output", function () {
				expect(output.name).toBe("Cameron");
			});
		});
	});
});