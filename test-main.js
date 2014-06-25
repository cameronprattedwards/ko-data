var tests = ['knockout'];
for (var file in window.__karma__.files) {
	console.log(file);
	if (/spec\.js$/.test(file)) {
	    tests.push(file);
	    console.log("included", file);
	}
}

require.config({
	deps: tests,
	paths: {
		'knockout': 'lib/knockout-3.1.0'
	},
	callback: window.__karma__.start,
	baseUrl: '/base'
});