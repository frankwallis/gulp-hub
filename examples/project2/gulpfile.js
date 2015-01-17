// this will use a private gulp instance
var gulp = require('gulp');
var gutil = require('gulp-util');

function precompile(cb) {
	gutil.log('precompiling project2')
	cb();
};

function compile(cb) {
	gutil.log('compiling project2')
	cb();
};

var build = gulp.series(precompile, compile);

gulp.task('build', build);
 
gulp.task('watch', function () {
	gulp.watch(['watchfile.js'], function() {
		gutil.log('watched project2');
	});
});

gulp.task('default', build);
