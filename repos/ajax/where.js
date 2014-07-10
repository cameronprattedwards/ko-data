define(["ko-data/repos/ajax/Builder"], function (Builder) {
	return function (field) {
		return new Builder(field);
	}
});