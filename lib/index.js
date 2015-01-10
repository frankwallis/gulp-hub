/*
 * gulp-hub
 * https://github.com/frankwallis/gulp-hub
 *
 * Copyright (c) 2014 Frank Wallis
 * Licensed under the MIT license.
 */
var path = require('path');
var util = require('gulp-util');
var resolveGlob = require('./resolve-glob');
var getSubfiles = require('./get-subfiles');
var loadSubfile = require('./load-subfile');
var addTask = require('./add-task');

// Creates a vanilla object with a `null` prototype (so we don't have to use
// `hasOwnProperty`) to maintain the state of the tasks registry
var tasks = Object.create(null);

/**
 * Load tasks from gulpfiles specified by the file `pattern`.
 * @param {string|array} pattern - A gulp-style file pattern to glob gulpfiles
 */
function loadFiles(pattern, rootDir) {    
    // assert `pattern` is a valid glob (non-empty string) or array of globs
    var isString = typeof pattern === 'string';
    var isArray = Array.isArray(pattern);
    if ((!isString && !isArray) || (pattern.length === 0)) {
        throw new TypeError('A glob pattern or an array of glob patterns is required.');
    }

    // find all the gulpfiles - needs to happen synchronously so we create the tasks before gulp runs
    var filelist = resolveGlob(pattern, rootDir)
        .map(function(filename) {
            return path.relative(process.cwd(), path.join(rootDir, filename));
        });

    var subfiles = getSubfiles(filelist);

    // load all the gulpfiles
    subfiles.forEach(function (subfile) {
        util.log( 'Loading', util.colors.yellow(subfile.relativePath));
        loadSubfile(subfile, tasks);
    });
}

/**
 * Returns the path of the file containing the function which called the function 
 * which called this function.
 */
function getCallSite() {
    var _callsite = require('callsite');
    var stack = _callsite();
    return stack[2].getFileName();
}

// support recursive calls (see examples)
var inhub = false;

function hub(pattern) {
    var callsite = getCallSite();
    var recursive = inhub;
    inhub = true;

    loadFiles(pattern, path.dirname(callsite));

    // only create the task tree once
    if (!recursive) {
        for (var name in tasks)
            addTask(tasks[name]);

        inhub = false;
    }
}

module.exports = hub;