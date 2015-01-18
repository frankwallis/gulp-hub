// this will use a private gulp instance
var gulp = require('gulp');
var gutil = require('gulp-util');

function precompile1B(cb) {
	gutil.log('precompiling project1B')
	cb();
};

function compile1B(cb) {
	gutil.log('compiling project1B')
	cb();
};

gulp.task('build', gulp.series(precompile1B, compile1B));

gulp.task('project1BTask', compile1B);

gulp.task('watch', function() {
	gulp.watch(['watchfile.js'], function() {
		gutil.log('watched project1A');
	});
});
