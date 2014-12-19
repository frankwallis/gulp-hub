// this will use a private gulp instance
var gulp = require('gulp');

gulp.task('dependency', function(cb) {
	console.log('running project2 dependency');
    cb();
});

gulp.task('compile', [ 'dependency' ], function(cb) {
	console.log('compiling project2');
    cb();
});
 
gulp.task('watch', function() {
	gulp.watch(['watchfile.js'], function() {
		console.log('watched project2');
	});
});

gulp.task('default', [ 'compile' ]);
