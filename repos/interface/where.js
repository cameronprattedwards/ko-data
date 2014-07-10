define(["ko-data/repo/interface/Builder"], function (Builder) {
	return function (field) {
		return new Builder(field);
	}
});