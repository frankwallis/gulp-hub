/* 
	You can run this by calling gulp from the command line.
	> gulp
	> gulp watch
	> gulp compile
*/
var gulp = require('gulp');
var gutil = require('gulp-util');
var hub = require('../lib/index.js');

// gulp.task('compile', function(cb) {
// 	console.log('compiling example');
//     cb();
// });

hub(['project1/gulpfile.js', 'proj*/gulpfile.js']);

gulp.task('local', function(cb) {
	console.log('this is a local task');
    cb();
});