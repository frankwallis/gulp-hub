var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

function test(cb) {
  gulp.src('lib/**/*.js')
    .pipe(istanbul()) 					// instrument the files
    .on('finish', function () {
      gulp.src(['test/*-spec.js', 'test/*-test.js'])
        .pipe(mocha())					// run the specs
        .pipe(istanbul.writeReports()) 	// write coverage reports
        .on('end', cb);
    });
}

gulp.task('test', test);
gulp.task('default', test);
