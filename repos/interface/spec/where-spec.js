define(["ko-data/repo/interface/where", "knockout"], function (where, ko) {
	describe("predicate", function () {
		it("returns a predicate builder", function () {
			var builder = where("id");
			expect(typeof builder.is).toBe("function");
		});

		describe("builder", function () {
			describe("#is()", function () {
				it("returns a Predicate object", function () {
					var builder = where("id"),
						pred = builder.is(9);

					var obj0 = {
							id: ko.observable(20)
						},
						obj1 = {
							id: ko.observable(9),
						},
						obj2 = {
							id: ko.observable(16)
						};

					var arr = [obj0, obj1, obj2];

					expect(pred(obj0)).toBe(false);
					expect(pred(obj1)).toBe(true);
					expect(pred(obj2)).toBe(false);

					var resultSet = arr.filter(pred);

					expect(resultSet.length).toBe(1);
					expect(resultSet[0]).toBe(obj1);
				});
			});
		});
	});
});