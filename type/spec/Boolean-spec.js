define(["../Boolean.js", "knockout"], function (Boolean, ko) {
	describe("Boolean", function () {
		var boolType = Boolean;

		describe("#getInstance", function () {
			it("is a function", function () {
				expect(typeof boolType.getInstance).toBe("function");
			});

			it("returns an observable boolean", function () {
				var instance = boolType.getInstance();
				expect(ko.isObservable(instance)).toBe(true);
				expect(typeof instance()).toBe("boolean");
			});

			it("defaults to false", function () {
				expect(ko.utils.unwrapObservable(boolType.getInstance())).toBe(false);
			});
		});

		it("is configurable", function () {
			expect(function () { Boolean() }).not.toThrow();
			var configged = Boolean({ value: true });
			expect(ko.utils.unwrapObservable(configged.getInstance())).toBe(true);
		});

		describe("#parse", function () {
			it("turns strings into booleans", function () {
				expect(boolType.parse("true")).toBe(true);
			});		
		});
	});

});