module.exports = function(task) {
    // create the unique subtasks
    task.subtasks.forEach(function (subtask) {
        gulp.task(subtask.name, subtask.parm1, subtask.parm2);
    });

    var args = task.subtasks.map(function (subtask) { return subtask.name; });

    // create the master task which will run all the subtasks in sequence
    gulp.task(task.name, function() {
        runSequence.apply(null, args);
    });
};
