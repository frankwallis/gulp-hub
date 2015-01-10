/* 
	You can run this by calling gulp from the command line.
	> gulp
	> gulp watch
	> gulp compile
*/
var gulp = require('gulp');
var gutil = require('gulp-util');
var hub = require('../lib/index.js');

gulp.task('compile', function(cb) {
	gutil.log('compiling example');
    cb();
});

gulp.task('default', [ 'compile' ]);

hub(['project1/gulpfile.js', 'proj*/gulpfile.js', 'gulpfile.js']);