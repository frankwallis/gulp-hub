/*
 * gulp-hub
 * https://github.com/frankwallis/gulp-hub
 *
 * Copyright (c) 2014 Frank Wallis
 * Licensed under the MIT license.
 */
var path = require('path');
var gulp = require('gulp');
var util = require('gulp-util');

var HubRegistry = require('./hub-registry');

var resolveGlob = require('./resolve-glob');
var loadSubfile = require('./load-subfile');

var hub = new HubRegistry();

/**
 * Get the directory of the file which gulp-hub was called from 
 * @returns string callsite - the directory of the file containing the function which called the function which called this function.
 */
function getCallSite() {
    var callsite = require('callsite');
    var stack = callsite();
    return stack[2].getFileName();
}

/**
 * Entry point
 * @param {string|array} pattern - A gulp-style file pattern to glob gulpfiles
 */
module.exports = function(pattern) {
    var callsite = getCallSite();

    // copy any existing tasks into the hub registry
    if (gulp.registry() != hub) {
        hub.setCurrentSubfile(callsite);
        gulp.registry(hub);
        hub.resetCurrentSubfile();
    }

    // resolve the list of gulpfiles
    var subfiles = resolveGlob(pattern, path.dirname(callsite));

    // load them all into the hub
    subfiles.forEach(function (subfile) {
        util.log( 'Loading', util.colors.yellow(subfile));
        
        hub.setCurrentSubfile(subfile);
        var gulpInst = loadSubfile(subfile);

        // if it used it's own gulp instance copy over the tasks        
        if (gulpInst.registry() != hub)
            gulpInst.registry(hub);

        hub.resetCurrentSubfile();
        
    });

    // create any tasks needed
    hub.flushPendingTasks();
}