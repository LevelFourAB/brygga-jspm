/**
 * JSPM plugin. Register tasks for building JavaScript.
 */

var brygga = require('brygga');
var jspm = require('jspm');
var path = require('path');
var fs = require('fs');

brygga.utils.task('js', function(cb) {
	var bundles = brygga.config.js.bundles;
	var keys = Object.keys(bundles);
	var count = keys.length;

	keys.forEach(function(name) {
		var opts = bundles[name];
		if(typeof opts === 'string') {
			opts = {
				expression: opts
			};
		}

		if(! opts.expression) {
			throw "expression is required for bundles, please update bundle " + name;
		}

		if(! opts.globalName) {
			opts.globalName = path.basename(opts);
		}

		var file = brygga.utils.destFile('js', name);
		jspm.build(opts.expression, file, {
			minify: true,
			sourceMaps: true,
			globalName: opts.globalName,
			production: true
		}).then(function() {
			if(--count <= 0) cb();
		}, function(err) {
			cb(err);
		});
	});
});

brygga.utils.gulp.task('js:watch', function() {
	var bundles = brygga.config.js.bundles;
	Object.keys(bundles).forEach(function(name) {
		brygga.utils.reloadBrowser(brygga.utils.destFile('js', name, ''));
	});
});

module.exports.tasks = [
	{
		task: 'js',
		description: 'Build a single JS file for this project'
	}
];
module.exports.config = {
	js: {
		root: 'js',

		bundles: {},

		watch: [ '**/*.js' ],

		watchTarget: 'js:watch',

		buildStep: 'cssjs'
	}
};

/*
 * Setup the routes needed during development.
 */
brygga.config.serve.routes['/src/jspm_packages'] = 'jspm_packages';
brygga.config.serve.routes['/src'] = 'src';
brygga.config.serve.routes['/js'] = function(req, res, next) {
	// TODO: This route should not be hardcoded to the path js

	var name = req.url.substring(1);
	var bundle = brygga.config.js.bundles[name];
	if(! bundle) {
		return next();
	}

	// Combine the files needed by JSPM 0.17.x
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	var filesToSend = [
		'jspm_packages/system.src.js',
		'jspm.browser.js',
		'jspm.config.js'
	];
	filesToSend.forEach(function(file) {
		res.write(fs.readFileSync(file));
	});

	// Write the import
	var bundleName = typeof bundle === 'string' ? bundle : bundle.expression;
	res.write('System.import("' + bundle + '");');
	res.end();
};
