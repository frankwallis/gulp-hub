var gulp = require('gulp');
var tsc = require('gulp-tsc');

var paths = {
	src: 'src/**/*.ts',
	dest: 'lib/'
};
 
var tscopts = {
	out: 'index.js',
	module: 'commonjs',
	declaration: true,
	sourcemap: true
};

gulp.task('compile', function() {
    return gulp.src(paths.src)
        .pipe(tsc(tscopts))
        .pipe(gulp.dest(paths.dest));
});
 
gulp.task('bump', ['compile'], function(){
    return gulp.src('./package.json')
        .pipe(bump({type:'minor'}))
        .pipe(gulp.dest('./'));
});

gulp.task('default', [ 'compile' ]);
