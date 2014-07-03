define(["ko-data/type/Collection", "ko-data/entity/Entity", "ko-data/type/String", "ko-data/type/Number", "knockout"], function (Collection, Entity, String, Number, ko) {
	describe("Collection", function () {
		var Person = Entity.extend({
			id: Number,
			name: String,
			age: Number
		});

		var collType = Collection(Person);

		describe("#getInstance()", function () {
			describe("return value", function () {
				var instance = collType.getInstance();

				it("is an observableArray", function () {
					expect(ko.isObservable(instance)).toBe(true);
					expect(instance() instanceof Array).toBe(true);
				});

				it("has a .errors array", function () {
					expect(ko.isObservable(instance.errors)).toBe(true);
					expect(instance.errors() instanceof Array).toBe(true);
				});

				describe("#validate()", function () {
					it("recognizes a non-Entity value", function () {
						instance.push("garbledigook");
						instance.push(1091);
						expect(instance.validate()).toBe(false);

						instance.splice(0, instance().length, new Person(), new Person({ name: "Gru", age: 19 }));
						expect(instance.validate()).toBe(true);
					});

					it("adds errors to .errors", function () {
						instance.removeAll();
						instance.push("nonsense", "something");
						instance.validate();
						expect(instance.errors().length).toBe(2);
						expect(instance.errors()[0]).toBe("value 0 must be an instance of generic Entity");
						expect(instance.errors()[1]).toBe("value 1 must be an instance of generic Entity");

						instance.splice(0, instance().length, new Person());
						instance.validate();
						expect(instance.errors().length).toBe(0);
					});
				});
			});
		});

		describe("#parse()", function () {
			var raw = [{ name: "Sally", age: 100, id: 65 }, { name: "Joe", age: 25, id: 100 }],
				parsed = collType.parse(raw);

			it("returns an Array", function () {
				expect(parsed instanceof Array).toBe(true);
				expect(parsed.length).toBe(2);
			});

			it("instantiates all children correctly", function () {
				expect(parsed[0] instanceof Person).toBe(true);
				expect(parsed[1] instanceof Person).toBe(true);
				expect(parsed[0].name()).toBe("Sally");
				expect(parsed[0].age()).toBe(100);

				expect(parsed[1].name()).toBe("Joe");
				expect(parsed[1].age()).toBe(25);
			});
		});

		describe("#serialize()", function () {
			it("returns an Array", function () {});

			it("serializes all children correctly", function () {});
		});
	});
});