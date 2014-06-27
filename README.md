ko-data
=======

Tools for your persistence and domain layers in Knockout. If you'd like a primer on Knockout, [this video](https://www.youtube.com/watch?v=AQbdDLweGxQ) is a great place to start. Ko-data depends on Knockout and RequireJS. If you're using the AJAX repository, it currently depends on jQuery.

To define an entity, simply do this:

```
define("Person", ["ko-data/entity/Entity", "ko-data/type/String", "ko-data/type/Date", "ko-data/type/Number", "knockout"], function (Entity, String, Date, Number, ko) {
    return Entity.extend({
        init: function () {
            var _self = this;

            this.over18 = ko.computed(function () {
                return (new Date().getFullYear() - _self.birthday().getFullYear()) > 18;
            });
        },
        id: Number,
        name: String,
        birthday: Date
    });
});
```

To define an entity, simply do this:

```
define("PersonRepo", ["Person", "ko-data/repo/ajax/Repo"], function (Person, Repo) {
    return Repo.extend({
        entity: Person,
        baseUrl: "/api",
        entityName: "person",
        pluralEntityName: "people"
    });
});
```

Then querying for people is as simple as this:

```
var peopleNamedCameron = PersonRepo.where(where("name").is("Cameron")); //returns a Knockout observableArray
```

To save a new entity:
```
var cameron = new Person({
    name: "Cameron",
    birthday: new Date(1988, 1, 1)
});
cameron.name(); //ko.observable
cameron.birthday(); //ko.observable
cameron.over18(); //ko.computed
PersonRepo.add(cameron);
PersonRepo.save(); //syncs up the entity to the data returned from the API.
```

Updating an entity is as as simple as:

```
cameron.name("Cam");
PersonRepo.save(); //returns a promise
```
To delete an entity:
```
PersonRepo.remove(cameron); //returns a promise
```

There are some other fancy things in here that deserve more documentation, like the fact that you can define a payload parser within your repository, and if you throw within that parser, it will cause the returned promise to be rejected.

The real genius of ko-data is simply that it handles AJAX response parsing declaratively. In the case of dates, for example, you specify that an entity property is a Date, and the property will be set to a date, even if it's an ISO string that comes back from the server.

Some gotchas:

1. Make sure you define RequireJS with keys of "ko-data", "knockout", and "jquery", mapping to your respective ko-data, knockout, and jquery lib files.
1. It currently handles only shallow entities - no entities within entities.

To come:
1. Custom types
1. Web sockets repo
1. Entities within entities

To see how it works, check out the []
