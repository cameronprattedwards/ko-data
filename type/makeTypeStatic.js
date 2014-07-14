define([], function () {
	return function (T, output) {
		output.getInstance = T.prototype.getInstance;
		output.parse = T.prototype.parse;
		output.serialize = T.prototype.serialize;
		output.validate = T.prototype.validate;
		output.mongoSerialize = T.prototype.mongoSerialize;
	};
});