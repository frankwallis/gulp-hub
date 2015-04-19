/*
	You can run this by calling gulp from the command line.
	examples> gulp build
	examples> gulp watch
	examples> gulp exampleTask
*/
var gulp = require('gulp');
var gutil = require('gulp-util');
var HubRegistry = require('../');

function precompile(cb) {
	gutil.log('precompiling example');
	cb();
};

function compile(cb) {
	gutil.log('compiling example')
	cb();
};

gulp.task('build', gulp.series(precompile, compile));
gulp.task('exampleTask', gulp.series(precompile, compile));

var hub = new HubRegistry(['./project*/gulpfile.js']);
gulp.registry(hub);
