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

    var args = task.subtasks.map(function (subtask) { return subtask.name; }),
        existingTask,
        taskName = task.name;

    // extend existing task
    if (gulp.hasTask(taskName)) {
        existingTask = gulp.tasks[taskName];

        // we change our generated task name so the existing task will not be overridden
        taskName = '__' + taskName;

        // and add that task name to the existing tasks dependencies
        existingTask.dep.push(taskName);
    }

    // create the master task which will run all the subtasks in sequence
    gulp.task(taskName, function(cb) {
        var _args = args.slice();
        _args.push(cb);
        runSequence.apply(null, _args);
    });
};
