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