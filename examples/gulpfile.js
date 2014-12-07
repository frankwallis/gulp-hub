/* 
	You can run this by calling gulp from the command line.
	> gulp
	> gulp watch
	> gulp compile
*/
var hub = require('../lib/index.js')
    gulp = require('gulp');

// main compile task, compile subtasks will be added as dependencies to this task
gulp.task('compile', function() {
    console.log('compiling: main task')
});

// call hub after all tasks in the main gulpfile have been added
hub(['project1/gulpfile.js', 'proj*/gulpfile.js', 'project1/**/gulpfile.js', '!node_modules/**']);