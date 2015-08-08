var gulp = require('gulp');

var FwdRef = require('undertaker-forward-reference');
var Hub = require('../../');

//gulp.registry(new FwdRef());

gulp.registry(new Hub(['./gulpfile2.js']));

//gulp.task('default', gulp.series('forward-ref', 'forward-ref2'));
gulp.task('default', gulp.series('forward-ref'));

gulp.task('forward-ref', function(cb){
	// do task things
	cb();
});