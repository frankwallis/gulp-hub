// this will use a private gulp instance
var gulp = require('gulp');
var gutil = require('gulp-util');

function precompile(cb) {
	gutil.log('precompiling project1A');
	cb();
};

function compile1A(cb) {
	gutil.log('compiling project1A')
	cb();
};

gulp.task('build', gulp.series(precompile, compile1A));

gulp.task('project1ATask', compile1A);

gulp.task('watch', function() {
	gulp.watch(['watchfile.js'], function() {
		gutil.log('watched project1A');
	});
});
