define(["../Date.js", "knockout"], function (DateType, ko) {
	describe("Date", function () {
		var dateType = DateType;

		describe("#getInstance", function () {
			it("is a function", function () {
				expect(typeof dateType.getInstance).toBe("function");
			});

			it("returns an observable Date", function () {
				var instance = dateType.getInstance();
				expect(ko.isObservable(instance)).toBe(true);
				expect(typeof instance()).toBe("object");
				expect(instance() instanceof Date).toBe(true);
			});

			it("defaults to now", function () {
				expect(new Date().getTime() - ko.utils.unwrapObservable(dateType.getInstance()).getTime()).toBeLessThan(100);
			});
		});

		it("is configurable", function () {
			expect(function () { DateType() }).not.toThrow();
			var configged = DateType({ getInstance: function () { return new Date(2014, 0, 1) } });
			var instance = ko.utils.unwrapObservable(configged.getInstance());
			expect(instance instanceof Date).toBe(true);
			expect(instance.getFullYear()).toBe(2014);
			expect(instance.getMonth()).toBe(0);
			expect(instance.getDate()).toBe(1);
		});

		describe("#parse", function () {
			it("returns Date parsed from input", function () {
				var dateStr = "2014-01-01T00:13:33.122Z",
					parsed = dateType.parse(dateStr);

				expect(parsed.getFullYear()).toBe(2013);
				expect(parsed.getMonth()).toBe(11);
				expect(parsed.getDate()).toBe(31);
			});
		});
	});
});