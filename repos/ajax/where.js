define(["ko-data/repo/ajax/Builder"], function (Builder) {
	return function (field) {
		return new Builder(field);
	}
});