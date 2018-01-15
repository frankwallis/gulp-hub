var gulp = require('gulp');
var gutil = require('../../../lib/gutil');

function bump(cb) {
	gutil.log('bumping project2')
	cb();
};

function publish(cb) {
	gutil.log('publishing project2')
	cb();
};

gulp.task('bump', bump);
gulp.task('publish', publish);
