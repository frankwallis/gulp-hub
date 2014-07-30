var path  = require('path');
var _     = require( 'lodash' );
var hutil = require('./hub-util');

/**
 * Adds a subfile's tasks to the task registry.
 *
 * @param  {object}         subfile - A subfile in `get-subfiles` form
 * @param  {object}         tasks   - The task registry. Will be modified!
 * @param  {string}         name    - The task name
 * @param  {array|function} parm1   - Gulp task param 1, a task dependency list, or a function
 * @param  {[function]}     parm2   - Gulp task param 2, a function (optional)
 * @returns - The output of the task function
 */
module.exports = function(subfile, tasks, name, parm1, parm2) {

    // param validation
    if (!hutil.isValidHubFile(subfile)) {
        throw new TypeError('`subfile` must be a valid Gulp Hub file object.');
    }
    if (!_.isPlainObject(tasks)) {
        throw new TypeError('`tasks` must be a plain object.');
    }
    if (typeof tasks !== 'string') {
        throw new TypeError('`name` must be a string.');
    }

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
};
