/*
 * gulp-hub
 * https://github.com/frankwallis/gulp-hub
 *
 * Copyright (c) 2014 Frank Wallis
 * Licensed under the MIT license.
 */
var util = require('gulp-util');
var resolveGlob = require('./resolve-glob');
var getSubfiles = require('./get-subfiles');
var loadSubfile = require('./load-subfile');
var addTask = require('./add-task');

// Creates a vanilla object with a `null` prototype (so we don't have to use
// `hasOwnProperty`) to maintain the state of the tasks registry
var tasks = Object.create( null );

/**
 * Load tasks from gulpfiles specified by the file `pattern`.
 * @param {string|array} pattern - A gulp-style file pattern to glob gulpfiles
 */
module.exports = function(pattern) {
    // assert `pattern` is a valid glob (non-empty string) or array of globs
    var isString = typeof pattern === 'string';
    var isArray = Array.isArray(pattern);
    if ((!isString && !isArray) || (pattern.length === 0)) {
        throw new TypeError('A glob pattern or an array of glob patterns is required.');
    }

    // find all the gulpfiles - needs to happen synchronously so we create the tasks before gulp runs
    var filelist = resolveGlob(pattern);
    var subfiles = getSubfiles(filelist);

    // load all the gulpfiles
    subfiles.forEach(function (subfile) {
        util.log( 'Loading', util.colors.yellow(subfile.relativePath));
        loadSubfile(subfile, tasks);
    });

    // create the task tree
    for (var name in tasks) {
        addTask(tasks[name]);
    }
};
