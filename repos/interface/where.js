if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["ko-data/repo/interface/Builder"], function (Builder) {
	return function (field) {
		return new Builder(field);
	}
});