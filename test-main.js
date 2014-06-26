var tests = ['knockout'];
for (var file in window.__karma__.files) {
	if (/spec\.js$/.test(file)) {
	    tests.push(file);
	    console.log("included", file);
	}
}

require.config({
	deps: tests,
	paths: {
		'knockout': 'lib/knockout-3.1.0',
		'jquery': 'lib/jquery-2.1.1.min.js',
		'ko-data': '.'
	},
	shim: {
		'jquery': {
			exports: '$'
		}
	},
	callback: window.__karma__.start,
	baseUrl: '/base'
});

require([], function () {});