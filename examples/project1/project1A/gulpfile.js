// this will use a private gulp instance
var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('precompile', function() {
	gutil.log('precompiling project1A')
});

gulp.task('compile', [ 'precompile' ], function() {
	gutil.log('compiling project1A')
});
 
gulp.task('watch', function() {
	gulp.watch(['watchfile.js'], function() {
		gutil.log('watched project1A');
	});
});

gulp.task('default', [ 'compile' ]);
