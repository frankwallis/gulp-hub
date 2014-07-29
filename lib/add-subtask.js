module.exports = function(subfile, name, parm1, parm2) {
    // register a master task with this name
    if (!tasks[name]) {
        tasks[name] = {};
        tasks[name].name = name;
        tasks[name].subtasks = [];
    }

    // give the subtask a unique name
    var subname = subfile.uniqueName + '-' + name;

    // sort out the task parameters
    var subparm1, subparm2;

    if (Array.isArray(parm1)) {
        // translate the dependencies to their unique names
        subparm1 = parm1.map(function (dep) { return subfile.uniqueName + '-' + dep; });

        if (parm2) {
            subparm2 = function() {
                // give the task function the correct working directory
                process.chdir(path.dirname(subfile.absolutePath));
                return parm2();
            };
        }
        else {
            subparm2 = undefined;
        }
    }
    else {
        subparm1 = function() {
            // give the task function the correct working directory
            process.chdir(path.dirname(subfile.absolutePath));
            return parm1();
        };
        subparm2 = undefined;
    }

    // add it to the master task
    tasks[name].subtasks.push({ "name": subname, "parm1": subparm1, "parm2": subparm2 });
}
