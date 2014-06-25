var tests = [];
for (var file in window.__karma__.files) {
	console.log(file);
	if (/test\.js$/.test(file)) {
	    tests.push(file);
	    console.log("included", file);
	}
}

require.config({
	deps: tests,
	callback: window.__karma__.start
});