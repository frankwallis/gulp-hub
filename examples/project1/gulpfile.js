//var hub = require('../../lib/index.js');
var gulp = require('gulp');
var gutil = require('gulp-util');
var HubRegistry = require('../../lib/');

function precompile(cb) {
	gutil.log('precompiling project1');
	cb();
};

function compile(cb) {
	gutil.log('compiling project1')
	cb();
};

gulp.task('build', gulp.series(precompile, compile));
gulp.task('project1Task', gulp.series(precompile, compile));

var hub = new HubRegistry(['./project*/gulpfile.js']);
gulp.registry(hub);
