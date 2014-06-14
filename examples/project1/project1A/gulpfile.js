// this will use a private gulp instance
var gulp = require('gulp');

gulp.task('dependency', function() {
	console.log('running project1A dependency')
});

gulp.task('compile', [ 'dependency' ], function() {
	console.log('compiling project1A')
});
 
gulp.task('watch', function() {
	gulp.watch(['watchfile.js'], function() {
		console.log('watched project1A');
	});
});

gulp.task('default', [ 'compile' ]);
