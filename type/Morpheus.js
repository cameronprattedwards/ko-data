if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function () {
	return {
		markDirty: true,
		markNew: true
	};
});