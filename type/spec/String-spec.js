define(["ko-data/type/String", "knockout"], function (String, ko) {
	describe("String", function () {
		var stringType = String;

		describe("#getInstance", function () {
			it("is a function", function () {
				expect(typeof stringType.getInstance).toBe("function");
			});

			it("returns an observable string", function () {
				var instance = stringType.getInstance();
				expect(ko.isObservable(instance)).toBe(true);
				expect(typeof instance()).toBe("string");
			});

			it("defaults to false", function () {
				expect(ko.utils.unwrapObservable(stringType.getInstance())).toBe("");
			});

			describe("return value", function () {
				it("has an errors array", function () {
					var instance = stringType.getInstance();
					expect(ko.isObservable(instance.errors)).toBe(true);
					expect(instance.errors() instanceof Array).toBe(true);
				});

				describe("#validate", function () {
					var instance = stringType.getInstance();

					it("recognizes a non-string value", function () {
						instance(false);
						expect(instance.validate()).toBe(false);

						instance("string");
						expect(instance.validate()).toBe(true);
					});

					it("adds errors to .errors", function () {
						instance(20);
						instance.validate();
						expect(instance.errors().length).toBe(1);
						expect(instance.errors()[0]).toBe("type of value must be string");

						instance("string");
						instance.validate();
						expect(instance.errors().length).toBe(0);
					});
				});
			});
		});

		it("is configurable", function () {
			expect(function () { String() }).not.toThrow();
			var configged = String({ value: true });
			expect(ko.utils.unwrapObservable(configged.getInstance())).toBe(true);
		});

		describe("#parse", function () {
			it("returns toStringed input", function () {
				expect(stringType.parse(true)).toBe("true");
			});		
		});
	});
});