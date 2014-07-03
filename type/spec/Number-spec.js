define(["ko-data/type/Number", "knockout"], function (Number, ko) {
	describe("Number", function () {
		var numType = Number;

		describe("#getInstance", function () {
			it("is a function", function () {
				expect(typeof numType.getInstance).toBe("function");
			});

			it("returns an observable number", function () {
				var instance = numType.getInstance();
				expect(ko.isObservable(instance)).toBe(true);
				expect(typeof instance()).toBe("number");
			});

			it("defaults to 0", function () {
				expect(ko.utils.unwrapObservable(numType.getInstance())).toBe(0);
			});

			describe("return value", function () {
				it("has an errors array", function () {
					var instance = numType.getInstance();
					expect(ko.isObservable(instance.errors)).toBe(true);
					expect(instance.errors() instanceof Array).toBe(true);
				});

				describe("#validate", function () {
					var instance = numType.getInstance();

					it("recognizes a non-number value", function () {
						instance("string");
						expect(instance.validate()).toBe(false);

						instance(10);
						expect(instance.validate()).toBe(true);
					});

					it("adds errors to .errors", function () {
						instance("string");
						instance.validate();
						expect(instance.errors().length).toBe(1);
						expect(instance.errors()[0]).toBe("type of value must be number");

						instance(10);
						instance.validate();
						expect(instance.errors().length).toBe(0);
					});
				});				
			});
		});

		it("is configurable", function () {
			expect(function () { Number() }).not.toThrow();
			var configged = Number({ value: 9 });
			expect(ko.utils.unwrapObservable(configged.getInstance())).toBe(9);
		});

		describe("#parse", function () {
			it("turns strings into numbers", function () {
				expect(numType.parse("17")).toBe(17);
			});		
		});
	});

});