var gulp = require('gulp');

var Hub = require('../../');

gulp.registry(new Hub(['./gulpfile2.js']));

gulp.task('default', gulp.series('forward-ref', 'forward-ref2'));

gulp.task('forward-ref', function(cb){
	// do task things
	cb();
});
