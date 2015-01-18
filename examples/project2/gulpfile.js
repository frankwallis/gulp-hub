// this will use a private gulp instance
var gulp = require('gulp');
var gutil = require('gulp-util');

function precompile2(cb) {
	gutil.log('precompiling project2')
	cb();
};

function compile2(cb) {
	gutil.log('compiling project2')
	cb();
};

var build = gulp.series(precompile2, compile2);

gulp.task('build', build);

gulp.task('watch', function () {
	gulp.watch(['watchfile.js'], function() {
		gutil.log('watched project2');
	});
});
