ko-data
=======

Tools for your persistence and domain layers in Knockout. Depends on Knockout and RequireJS. If you're using the AJAX repository, it currently depends on jQuery.

To define an entity, simply do this:

```
define("Person", ["ko-data/entity/Entity", "ko-data/type/String", "ko-data/type/Date", "ko-data/type/Number"], function (Entity, String, Date, Number) {
    return Entity.extend({
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
var peopleNamedCameron = PersonRepo.where(where("name").is("Cameron"));
```

Updating an entity is as as simple as:

```
cameron.name("Cam");
PersonRepo.add(cameron);
PersonRepo.save(); //returns a promise
```
To delete an entity:
```
PersonRepo.remove(cameron); //returns a promise
```

There are some other fancy things in here that deserve more documentation, like the fact that you can define a payload parser within your repository, and if you throw within that parser, it will cause the returned promise to be rejected.

Some gotchas:

1. Make sure you define RequireJS with keys of "ko-data", "knockout", and "jquery", mapping to your respective ko-data, knockout, and jquery lib files.
1. It currently handles only shallow entities - no entities within entities.
