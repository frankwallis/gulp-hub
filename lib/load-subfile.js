var gulp = require('gulp');
var addSubtask = require('./add-subtask');

module.exports = function(subfile) {
    // keep reference to gulp.task function
    var originalTaskFn = gulp.Gulp.prototype.task;

    // redirect gulp.task to call our function instead in case they are using our instance of gulp
    gulp.Gulp.prototype.task = function (name, parm1, parm2) {
        addSubtask(subfile, name, parm1, parm2);
    };

    // load the file
    require(subfile.absolutePath);

    // if that gulpfile used its own local gulp installation
    // then we need to transfer the tasks out of that into ours
    var submodule = module.children[module.children.length -1];
    addLocalGulpTasks(subfile, submodule);

    // restore gulp.task function
    gulp.Gulp.prototype.task = originalTaskFn;
};

// I see trouble ahead...
function addLocalGulpTasks(subfile, submodule) {

    submodule.children.forEach(function(mod) {

        // find the gulp module
        if (path.basename(path.dirname(mod.id)) === 'gulp') {

            // get the gulp instance
            var localInst = mod.exports;

            // copy all the tasks over
            for (var name in localInst.tasks) {
                if (localInst.tasks.hasOwnProperty(name)) {
                    var task = localInst.tasks[name];
                    addSubtask(subfile, task.name, task.dep, task.fn);
                }
            }
        }
    });
}
