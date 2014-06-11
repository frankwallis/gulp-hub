var gulp = require('gulp');
 
gulp.task('bump', ['compile'], function(){
    return gulp.src('./package.json')
        .pipe(bump({type:'minor'}))
        .pipe(gulp.dest('./'));
});