var path  = require('path');
var _     = require( 'lodash' );
var hutil = require('./hub-util');

/**
 * Adds a subfile's tasks to the task registry.
 *
 * @param  {object}         subfile - A subfile in `get-subfiles` form
 * @param  {object}         tasks   - The task registry. Will be modified!
 * @param  {string}         name    - The task name
 * @param  {array|function} param1  - Gulp task param 1, a task dependency list, or a function
 * @param  {[function]}     param2  - Gulp task param 2, a function (optional)
 * @returns - The output of the task function
 */
module.exports = function(subfile, tasks, name, param1, param2) {

    // param validation
    if (!hutil.isValidHubFile(subfile)) {
        throw new TypeError('`subfile` must be a valid Gulp Hub file object.');
    }
    if (!_.isPlainObject(tasks)) {
        throw new TypeError('`tasks` must be a plain object.');
    }
    if (!_.isString(name)) {
        throw new TypeError('`name` must be a string.');
    }
    if (!_.isArray(param1) && !_.isFunction(param1)) {
        throw new TypeError('`param1` must be an array or function.');
    }
    if (!_.isFunction(param2) && !_.isUndefined(param2)) {
        throw new TypeError('`param2` must be a function or undefined.');
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
    var subparam1, subparam2;

    if (Array.isArray(param1)) {
        // translate the dependencies to their unique names
        subparam1 = param1.map(function (dep) { return subfile.uniqueName + '-' + dep; });

        if (param2) {
            subparam2 = function() {
                // give the task function the correct working directory
                process.chdir(path.dirname(subfile.absolutePath));
                return param2();
            };
        }
        else {
            subparam2 = undefined;
        }
    }
    else {
        subparam1 = function() {
            // give the task function the correct working directory
            process.chdir(path.dirname(subfile.absolutePath));
            return param1();
        };
        subparam2 = undefined;
    }

    // add it to the master task
    tasks[name].subtasks.push({ "name": subname, "param1": subparam1, "param2": subparam2 });
};
