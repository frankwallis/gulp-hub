// this will use a private gulp instance
var gulp = require('gulp');
var gutil = require('gulp-util');

function precompile(cb) {
	gutil.log('precompiling project1B')
	cb();
};

function compile(cb) {
	gutil.log('compiling project1B')
	cb();
};

gulp.task('compile', gulp.series(precompile, compile));
 
gulp.task('watch', function() {
	gulp.watch(['watchfile.js'], function() {
		gutil.log('watched project1A');
	});
});

gulp.task('default', compile);
