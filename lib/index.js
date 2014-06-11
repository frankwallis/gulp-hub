/*
 * gulp-hub
 * https://github.com/frankwallis/gulp-hub
 *
 * Copyright (c) 2014 Frank Wallis
 * Licensed under the MIT license.
 */

var gulp = require('gulp');
var glob = require('glob');
var path = require('path');

var tasks = {};

function hub(pattern) {
    // find all the gulpfiles
    // needs to be syncronous so we create the tasks before gulp runs
    var filelist = glob.sync(pattern);

    // keep reference to gulp.task function
    var originalTaskFn = gulp.Gulp.prototype.task;

    // load all the gulpfiles
    filelist.forEach(function (file, idx) {
        // get the absolute directory of this gulpfile
        var absolutePath = path.resolve(file);
        var directory = path.dirname(absolutePath);
        
        // redirect gulp.task to call our function instead
        gulp.Gulp.prototype.task = function (name, parm1, parm2) {
            addSubtask(directory, idx, name, parm1, parm2);
        };

        // load the file
        require(absolutePath);
    });

    // restore gulp.task function
    gulp.Gulp.prototype.task = originalTaskFn;
    
    // create the task tree
    for (var name in tasks) {
        if (tasks.hasOwnProperty(name)) {
            var task = tasks[name];

            // create the unique subtasks
            task.subtasks.forEach(function (subtask) {
                return gulp.task(subtask.name, subtask.parm1, subtask.parm2);
            });

            // create the master task which is dependent on all of the subtasks
            gulp.task(name, task.subtasks.map(function (subtask) {
                return subtask.name;
            }));
        }
    }
}

function addSubtask(directory, idx, name, parm1, parm2) {
    // register a master task with this name
    if (!tasks[name]) {
        tasks[name] = {};
        tasks[name].subtasks = [];
    }

    // give the subtask a unique name
    var subname = name + idx;

    // sort out the task parameters   
    var subparm1, subparm2;

    if (Array.isArray(parm1)) {
        // translate the dependencies to their unique names
        subparm1 = parm1.map(function (dep) { return dep + idx; });
        
        if (parm2) {
            subparm2 = function() {
                // give the task function the correct working directory
                process.chdir(directory);
                parm2();
            }
        }
        else {
            subparm2 = undefined;
        }
    }
    else {
        subparm1 = function() {
            // give the task function the correct working directory
            process.chdir(directory);
            parm1();
        }
        subparm2 = undefined;
    }
   
    // add it to the master task
    tasks[name].subtasks.push({ "name": subname, "directory": directory, "parm1": subparm1, "parm2": subparm2 });
}

module.exports = hub;