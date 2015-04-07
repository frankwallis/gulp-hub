var gulp = require('gulp');
var gutil = require('gulp-util');

function e2e(cb) {
	gutil.log('running e2e-tests')
	cb();
};

function unit(cb) {
   gutil.log('running unit-tests')
	cb();
};

gulp.task('e2e', e2e);
gulp.task('test', unit);
