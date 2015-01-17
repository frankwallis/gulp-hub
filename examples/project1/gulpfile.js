var hub = require('../../lib/index.js');
var gulp = require('gulp');
var gutil = require('gulp-util');

function precompile(cb) {
	gutil.log('precompiling project1');
	cb();
};

function compile(cb) {
	gutil.log('compiling project1')
	cb();
};

gulp.task('compile', gulp.series(precompile, compile));
gulp.task('default', gulp.series(precompile, compile));

//hub(['project*/gulpfile.js']);