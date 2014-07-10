define(["ko-data/repo/interface/Builder", "knockout"], function (Builder, ko) {
	describe("Builder", function () {
		var builder = new Builder("name");
		
		describe("new()", function () {
			it("sets the #field property", function () {
				expect(builder.field).toBe("name");
			});
		});

		describe("#is()", function () {
			var predicate = builder.is("Cameron");
			
			it("returns a function", function () {
				expect(typeof predicate).toBe("function");
			});

			describe("return value", function () {
				it("checks its input against the comparator", function () {
					var obj = {
							name: ko.observable("Sally")
						},
						obj1 = {
							name: ko.observable("Cameron")
						}

					expect(predicate(obj)).toBe(false);
					expect(predicate(obj1)).toBe(true);
				});
			});
		});
	});
});