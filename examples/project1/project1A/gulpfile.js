// this will use a private gulp instance
var gulp = require('gulp');
var gutil = require('gulp-util');

function precompile1A(cb) {
	gutil.log('precompiling project1A');
	cb();
};
precompile1A.description = 'Precompiling project1A';
precompile1A.flags = {
    '--prod': 'Precompiling in production mode (minification, etc).',
    '--dev': 'Precompiling in development mode.'
};

function compile1A(cb) {
	gutil.log('compiling project1A')
	cb();
};

gulp.task('precompile1A', precompile1A);
gulp.task('compile1A', compile1A);

gulp.task('build', gulp.series('precompile1A', 'compile1A'));
gulp.task('project1ATask', compile1A);

gulp.task('watch', function() {
	gulp.watch(['watchfile.js'], function() {
		gutil.log('watched project1A');
	});
});
