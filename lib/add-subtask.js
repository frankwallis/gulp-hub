var path  = require('path');
var _     = require( 'lodash' );
var hutil = require('./hub-util');

var makeSubtaskFunction = function(subfile, subfn) {
    if (subfn.length > 0) {
        // subfn is asynchronous (has callback parameter)
        return function(cb) {
            // give the task function the correct working directory
            process.chdir(path.dirname(subfile.absolutePath));
            return subfn(cb);
        };
    }
    // subfn is synchronous (no callback parameter)
    return function() {
        // give the task function the correct working directory
        process.chdir(path.dirname(subfile.absolutePath));
        return subfn();
    };
};

/**
 * Adds a subfile's tasks, task dependencies, and callback to the task registry
 * under the master task name, e.g., given a task name `task-name`, and a
 * subfile like the following,
 *
 *     {
 *         absolutePath: /a/b/c.js,
 *         relativepath: b/c.js,
 *         uniqueName:   b/c.js
 *     }
 *
 * the task registry would gain an entry like the following,
 *
 *     {
 *         'task-name': {
 *             name:     'task-name',                // master task name
 *             subtasks: [
 *                 {
 *                     'name':   'b/c.js-task-name', // prefixed subtask name
 *                     'param1': [                   // prefixed subtask deps (optional)
 *                         'b/c.js-task-name-dep-1',
 *                         'b/c.js-task-name-dep-2',
 *                     ],
 *                     'param2': function () { ... } // subtask callback
 *                 },
 *                 ...                               // other subtask records from other subfiles
 *             ]
 *         },
 *         ...                                       // other master tasks
 *     }
 *
 * Note that subtask dependencies are optional, i.e., `param1` would contain
 * the subtask callback, and `param2` would be `undefined`.
 *
 * @param  {object}         subfile - A subfile in `get-subfiles` form
 * @param  {object}         tasks   - The task registry. Will be modified!
 * @param  {string}         name    - The task name
 * @param  {array|function} param1  - Gulp task param 1, a task dependency list, or a function
 * @param  {[function]}     param2  - Gulp task param 2, a function (optional)
 *
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
            subparam2 = makeSubtaskFunction(subfile, param2);
        }
        else {
            subparam2 = undefined;
        }
    }
    else {
        subparam1 = makeSubtaskFunction(subfile, param1);
        subparam2 = undefined;
    }

    // add it to the master task
    tasks[name].subtasks.push({ "name": subname, "param1": subparam1, "param2": subparam2 });
};
