var gulp = require('gulp');

gulp.task('compile', function() {
	console.log('compiling project1')
});

gulp.task('watch', function() {
	gulp.watch(['./watchfile.js'], function() {
		console.log('watched project1');
	});
});
 
gulp.task('default', [ 'compile' ]);
