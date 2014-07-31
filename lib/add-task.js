var gulp = require('gulp');
var runSequence = require('run-sequence');

/**
 * Register the subtasks of the given tasks, and configure the master task to
 * run them.
 *
 * @param  {object} task - A task object from the task registry
 */
module.exports = function(task) {
    // create the unique subtasks
    task.subtasks.forEach(function (subtask) {
        gulp.task(subtask.name, subtask.param1, subtask.param2);
    });

    var args = task.subtasks.map(function (subtask) { return subtask.name; });

    // create the master task which will run all the subtasks in sequence
    gulp.task(task.name, function() {
        runSequence.apply(null, args);
    });
};
