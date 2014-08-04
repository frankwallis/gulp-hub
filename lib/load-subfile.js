var gulp = require('gulp');
var hutil = require('./hub-util');
var addSubtask = require('./add-subtask');
var path = require('path');

/**
 * Load the tasks from the specified gulpfile and register them with the task
 * registry.
 *
 * @param  {object} subfile - A gulp-hub file object
 * @param  {object} tasks   - The task registry. Will be modified.
 */
module.exports = function(subfile, tasks) {

    // param validation
    if(!hutil.isValidHubFile(subfile)) {
        throw new TypeError('`subfile` must be a valid Gulp Hub file object.');
    }
    if(!(typeof tasks === 'object' && tasks !== null && !Array.isArray(tasks))) {
        throw new TypeError('`task` must be an object');
    }

    // keep reference to gulp.task function
    var originalTaskFn = gulp.Gulp.prototype.task;

    // redirect gulp.task to call our function instead in case they are using our instance of gulp
    gulp.Gulp.prototype.task = function (name, parm1, parm2) {
        addSubtask(subfile, tasks, name, parm1, parm2);
    };

    // load the file
    require(subfile.absolutePath);

    // if that gulpfile used its own local gulp installation
    // then we need to transfer the tasks out of that into ours
    var submodule = module.children[module.children.length -1];
    addLocalGulpTasks(subfile, submodule, tasks);

    // restore gulp.task function
    gulp.Gulp.prototype.task = originalTaskFn;
};

// I see trouble ahead...
function addLocalGulpTasks(subfile, submodule, tasks) {

    submodule.children.forEach(function(mod) {

        // find the gulp module
        if (path.basename(path.dirname(mod.id)) === 'gulp') {

            // get the gulp instance
            var localInst = mod.exports;

            // copy all the tasks over
            for (var name in localInst.tasks) {
                if (localInst.tasks.hasOwnProperty(name)) {
                    var task = localInst.tasks[name];
                    addSubtask(subfile, tasks, task.name, task.dep, task.fn);
                }
            }
        }
    });
}
