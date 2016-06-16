var gulp = require('gulp');
var hutil = require('./hub-util');
var addSubtask = require('./add-subtask');
var path = require('path');
var proxyquire = require('proxyquire');

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
    var usingLocal = true;

    // redirect gulp.task to call our function instead in case they are using our instance of gulp
    gulp.Gulp.prototype.task = function (name, parm1, parm2) {
        addSubtask(subfile, tasks, name, parm1, parm2);
        usingLocal = false;
    };

	proxyquire(subfile.absolutePath,{
		gulp:gulp
	});

    // if that gulpfile used its own local gulp installation
    // then we need to transfer the tasks out of that into ours
    if (usingLocal) {
        var submodule = findModule(function(mod) {
            return (mod.id === subfile.absolutePath);
        });

        if (submodule)
            addLocalGulpTasks(subfile, submodule, tasks);
    }

    // restore gulp.task function
    gulp.Gulp.prototype.task = originalTaskFn;
};

function findModule(pred, parent) {
    parent = parent || module;

    for (i = 0; i < parent.children.length; i ++) {
        if (pred(parent.children[i]))
            return parent.children[i];
    }

    return parent.parent ? findModule(pred, parent.parent) : undefined;
}

// I see trouble ahead...
function addLocalGulpTasks(subfile, submodule, tasks) {

    var gulpMod = findModule(function(mod) {
        return (path.basename(path.dirname(mod.id)) === 'gulp');
    }, submodule);

    var localInst = gulpMod.exports;

    // copy all the tasks over
    for (var name in localInst.tasks) {
        if (localInst.tasks.hasOwnProperty(name)) {
            var task = localInst.tasks[name];

            if (!task.__hubadded) {
                task.__hubadded = true;
                addSubtask(subfile, tasks, task.name, task.dep, task.fn);
            }
        }
    }
}
