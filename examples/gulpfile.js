/* 
	You can run this by calling gulp from the command line.
	> gulp
	> gulp watch
	> gulp compile
*/
var gulp = require('gulp');
var gutil = require('gulp-util');
var hub = require('../lib/index.js');

function precompile(cb) {
	gutil.log('precompiling example');
	cb();
};

function compile(cb) {
	gutil.log('compiling example')
	cb();
};

gulp.task('build', gulp.series(precompile, compile));
gulp.task('compile', gulp.series(precompile, compile));

hub(['project1/gulpfile.js', 'proj*/gulpfile.js']);