var gulp = require('gulp');

gulp.task('dependency', function() {
	console.log('running project2 dependency')
});

gulp.task('compile', [ 'dependency' ], function() {
	console.log('compiling project2')
});
 
gulp.task('default', [ 'compile' ]);
