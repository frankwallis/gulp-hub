var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

function test(cb) {
  gulp.src('lib/**/*.js')
    .pipe(istanbul()) // Covering files
    .on('finish', function () {
      gulp.src(['test/*-spec.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports()) // Creating the reports after tests runned
        .on('end', cb);
    });
}

gulp.task('test', test);
gulp.task('default', test);
