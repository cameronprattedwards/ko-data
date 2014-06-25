define(["../String.js", "knockout"], function (String, ko) {
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