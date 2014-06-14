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
var util = require('gulp-util');
var runSequence = require('run-sequence');

var tasks = {};

function hub(pattern) {
    // find all the gulpfiles - needs to happen synchronously so we create the tasks before gulp runs
    var filelist = resolveGlob(pattern);
    var subfiles = getSubfiles(filelist);

    // keep reference to gulp.task function
    var originalTaskFn = gulp.Gulp.prototype.task;

    // load all the gulpfiles
    subfiles.forEach(function (subfile) {
        // redirect gulp.task to call our function instead in case they are using our instance
        gulp.Gulp.prototype.task = function (name, parm1, parm2) {
            addSubtask(subfile, name, parm1, parm2);
        };

    
        // load the file
        util.log( 'Loading', util.colors.yellow(subfile.relativePath));
        require(subfile.absolutePath);

        // if that gulpfile used its own local gulp installation 
        // then we need to transfer the tasks out of that into ours
        var submodule = module.children[module.children.length -1];
        addLocalGulpTasks(subfile, submodule);
    });

    // restore gulp.task function
    gulp.Gulp.prototype.task = originalTaskFn;
    
    // create the task tree
    for (var name in tasks) {
        if (tasks.hasOwnProperty(name)) {
            addTask(tasks[name]);
        }
    }
}

function addTask(task) {
    // create the unique subtasks
    task.subtasks.forEach(function (subtask) {
        gulp.task(subtask.name, subtask.parm1, subtask.parm2);
    });

    var args = task.subtasks.map(function (subtask) { return subtask.name; });
    
    // create the master task which is dependent on all of the subtasks
    gulp.task(task.name, function() {
        runSequence.apply(null, args);
    });
}

function resolveGlob(pattern) {
    if (Array.isArray(pattern)) {
        if (pattern.length === 1)
            pattern = pattern[0];
        else
            pattern = '{' + pattern.join(',') + '}';
    }

    return glob.sync(pattern, { "nosort": true });
}

function getSubfiles(filelist) {
    var result = [];

    filelist.forEach(function (file, idx) {
        var subfile = {};

        subfile.relativePath = file;
        subfile.absolutePath = path.resolve(file);
        subfile.directory = path.dirname(subfile.absolutePath);

        // give it a unique name (could be improved)        
        subfile.uniqueName = path.basename(subfile.directory);

        result.push(subfile);
    });

    return result;
}

function addSubtask(subfile, name, parm1, parm2) {
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
                process.chdir(subfile.directory);
                return parm2();
            }
        }
        else {
            subparm2 = undefined;
        }
    }
    else {
        subparm1 = function() {
            // give the task function the correct working directory
            process.chdir(subfile.directory);
            return parm1();
        }
        subparm2 = undefined;
    }
   
    // add it to the master task
    tasks[name].subtasks.push({ "name": subname, "parm1": subparm1, "parm2": subparm2 });
}

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

module.exports = hub;