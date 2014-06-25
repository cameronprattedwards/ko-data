define(["entity/Entity", "knockout", "type/Number", "type/Date", "type/String"], function (Entity, ko, Number, DateType, String) {
	describe("Entity", function () {
		var Person,
			Student,
			person,
			student,
			cam,
			jess;

		describe("#extend()", function () {
			Person = Entity.extend({
				speak: function (words) {
					console.log(words);
				},
				jump: function (feet) {
					console.log("I'm jumping " + feet + " feet in the air.");
				},
				species: "homo sapiens",
				age: Number(),
				birthday: DateType,
				name: String
			});

			person = new Person();

			it("should behave like Object.extend", function () {
				expect(new Person() instanceof Entity).toBe(true);
				expect(typeof Person.prototype.speak).toBe("function");
				expect(Person.prototype.species).toBe("homo sapiens");
				expect(typeof Person.prototype.jump).toBe("function");
			});

			it("should set all types on the properties hash", function () {
				var props = Person.prototype.properties;
				expect(typeof props.age.getInstance).toBe("function");
				expect(typeof props.name.getInstance).toBe("function");
				expect(typeof props.birthday.getInstance).toBe("function");
			});

			it("passes properties down deep prototype chains", function () {
				Student = Person.extend({
					grade: Number,
					className: String(),
					graduationDate: DateType
				});
				var props = Student.prototype.properties;
				student = new Student();

				expect(typeof props.age.getInstance).toBe("function");
				expect(typeof props.name.getInstance).toBe("function");
				expect(typeof props.birthday.getInstance).toBe("function");
				expect(typeof props.grade.getInstance).toBe("function");
				expect(typeof props.className.getInstance).toBe("function");
				expect(typeof props.graduationDate.getInstance).toBe("function");
			});
		});

		describe("new()", function () {
			it("should contain a .properties hash", function () {
				expect(typeof person.properties).toBe("object");
			});

			it("should have basic state properties", function () {
				expect(ko.isObservable(person.isLoading)).toBe(true);
				expect(ko.isObservable(person.isNew)).toBe(true);
				expect(ko.isObservable(person.isDirty)).toBe(true);
			});

			it("should be set to correct state", function () {
				expect(person.isNew()).toBe(true);
				expect(person.isLoading()).toBe(false);
				expect(person.isDirty()).toBe(false);
			});

			it("sets instances of properties on itself", function () {
				expect(ko.isObservable(student.age)).toBe(true);
				expect(ko.isObservable(student.birthday)).toBe(true);
				expect(ko.isObservable(student.name)).toBe(true);
				expect(ko.isObservable(student.grade)).toBe(true);
				expect(ko.isObservable(student.className)).toBe(true);
				expect(ko.isObservable(student.graduationDate)).toBe(true);

				expect(student.age()).toBe(0);
				expect(student.birthday() instanceof Date).toBe(true);
				expect(student.name()).toBe("");
				expect(student.grade()).toBe(0);
				expect(student.className()).toBe("");
				expect(student.graduationDate() instanceof Date).toBe(true);
			});

			it("accepts a hash of values", function () {
				cam = new Person({
					age: 26,
					birthday: new Date(1988, 3, 17),
					name: "Cameron"
				});

				expect(cam.age()).toBe(26);
				expect(cam.birthday() instanceof Date).toBe(true);
				expect(cam.name()).toBe("Cameron");

				jess = new Student({
					age: 20,
					birthday: new Date(1994, 9, 16),
					name: "Jessica",
					className: "Social Work",
					graduationDate: new Date(2016, 4, 1),
					grade: 4
				});

				expect(jess.age()).toBe(20);
				expect(jess.birthday() instanceof Date).toBe(true);
				expect(jess.name()).toBe("Jessica");
				expect(jess.className()).toBe("Social Work");
				expect(jess.graduationDate() instanceof Date).toBe(true);
				expect(jess.grade()).toBe(4);
			});

			it("initializes state correctly", function () {
				expect(cam.age.isDirty()).toBe(false);
				expect(jess.name.isDirty()).toBe(false);

				expect(cam.isNew()).toBe(true);
				expect(cam.isDirty()).toBe(false);
				expect(jess.isNew()).toBe(true);
				expect(jess.isDirty()).toBe(false);
				expect(cam.isLoading()).toBe(false);
				expect(jess.isLoading()).toBe(false);
			});
		});
	});
});

























