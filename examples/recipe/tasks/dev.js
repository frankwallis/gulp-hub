var gulp = require('gulp');
var gutil = require('../../../lib/gutil');

function bundle(cb) {
	gutil.log('bundling project2')
	cb();
};

function serve(cb) {
	gutil.log('serving project2')
	cb();
};

gulp.task('bundle', bundle);
gulp.task('serve', serve);
