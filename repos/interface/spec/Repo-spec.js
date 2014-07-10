define(["ko-data/repo/interface/Repo", "ko-data/entity/Entity", "ko-data/type/Number", "ko-data/type/String", "ko-data/repo/interface/where"], function (Repo, Entity, Number, String, where) {
	describe("Repo interface", function () {
		var cam,
			jess;

		var Person = Entity.extend({
			id: Number,
			name: String
		});

		var PersonRepo = Repo.extend({
			entity: Person
		});

		var personRepo = new PersonRepo();

		describe("add", function () {
			it("adds entities to the repo", function () {
				cam = new Person({
					id: 10,
					name: "Cameron"
				});

				jess = new Person({
					id: 19,
					name: "Jessica"
				});

				expect(typeof personRepo.add).toBe("function");
				personRepo.add(cam);
				personRepo.add(jess);
			});
		});

		describe("save", function () {
			it("is a function", function () {
				expect(typeof personRepo.save).toBe("function");
			});

			it("returns a promise", function () {
				var promise = personRepo.save();
				expect(typeof promise.done).toBe("function");
				expect(typeof promise.fail).toBe("function");
				expect(typeof promise.always).toBe("function");
			});
		});

		describe("where", function () {
			it("filters based on predicates", function () {
				var promise = personRepo.where(
					where("id").is(10)
				);

				promise.done(function (results) {
					expect(results.length).toBe(1);
					expect(results[0]).toBe(cam);
				});

				promise = personRepo.where(
					where("name").is("Jessica")
				);

				promise.done(function (results) {
					expect(results.length).toBe(1);
					expect(results[0]).toBe(jess);
				});

				promise = personRepo.where();

				promise.done(function (results) {
					expect(results.length).toBe(2);
					expect(results[0]).toBe(cam);
					expect(results[1]).toBe(jess);
				});
			});
		});
	});
});