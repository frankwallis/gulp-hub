/*
 * gulp-hub
 * https://github.com/frankwallis/gulp-hub
 *
 * Copyright (c) 2014 Frank Wallis
 * Licensed under the MIT license.
 */

var gulp = require('gulp');
var glob = require('glob');

module.exports = function(pattern) {
  	var originalTaskFn = gulp.Gulp.prototype.task;

    var filelist = glob.sync(pattern);
    
    filelist.forEach(function (file, idx) {
        var directory = '';

        gulp.Gulp.prototype.task = function (name, deps, task) {
            addSubtask(directory, idx, name, deps, task);
        };

        require(process.cwd() + '/' + file);
    });

    gulp.Gulp.prototype.task = originalTaskFn;
    
    for (var name in tasks) {
        if (tasks.hasOwnProperty(name)) {
            var task = tasks[name];

            task.subtasks.forEach(function (subtask) {
                return gulp.add(subtask.name, subtask.deps, subtask.fn);
            });

            // create the master task which is dependent on all of the subtasks
            gulp.add(name, task.subtasks.map(function (subtask) {
                return subtask.name;
            }));
        }
    }
}

var tasks = {};

function addSubtask(directory, idx, name, deps, task) {
    //console.log('adding task ' + name);

    if (!tasks[name]) {
        tasks[name] = {};
        tasks[name].subtasks = [];
    }

    var subname = name + idx;
    var subdeps = deps;

    if (Array.isArray(deps))
        subdeps = deps.map(function (dep) {
            return dep + idx;
        });

    tasks[name].subtasks.push({ name: subname, directory: directory, deps: subdeps, fn: task });
}
