var hub = require('../../lib/index.js');
var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('compile', function() {
	gutil.log('compiling project1');
});

gulp.task('default', [ 'compile' ]);

hub(['project*/gulpfile.js']);