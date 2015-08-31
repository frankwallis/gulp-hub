/*
 * gulp-hub
 * https://github.com/frankwallis/gulp-hub
 *
 * Copyright (c) 2014 Frank Wallis
 * Licensed under the MIT license.
 */
var path = require('path');
var util = require('util');

var _ = require('lodash');
var gutil = require('gulp-util');

var ForwardRegistry = require('undertaker-forward-reference');

var resolveGlob = require('./resolve-glob');
var loadSubfile = require('./load-subfile');


function HubRegistry(pattern) {
	if (!(this instanceof HubRegistry))
		return new HubRegistry(pattern);

	ForwardRegistry.call(this);

	this._registry = {};
	this._callsite = this.getCallSite();

	// resolve the list of gulpfiles
	this._gulpfiles = resolveGlob(pattern, path.dirname(this._callsite));

	// setup an internal subfile in case tasks are added from the existing registry
	this._registry[this._callsite] = new ForwardRegistry();
}

util.inherits(HubRegistry, ForwardRegistry);

/**
 * Get the directory of the file which gulp-hub was called from
 * @returns string callsite - the file containing the function which called the function which called this function.
 */
HubRegistry.prototype.getCallSite = function() {
	var callsite = require('callsite');
	var stack = callsite();
	return stack[2].getFileName();
}

/**
 * Registry API
 * Initalise the registry
 */
HubRegistry.prototype.init = function (gulp) {
	// load the subfiles into the registry map
	var self = this;
	_.each(this._gulpfiles, function(gulpfile) {
		gutil.log('Loading', gutil.colors.yellow(gulpfile));
		self._registry[gulpfile] = loadSubfile(gulp, gulpfile);
	});

	var master = {};
	var sandboxedGulp = new gulp.Gulp();

	// assign new, unique names to each of the subtasks,
	// this means recreating all the subtasks using gulp.task
	_.each(this._registry, function(subregistry, subfileName) {
		var subtasks = subregistry.tasks();

		_.each(subtasks, function(subtask, name) {
			var subname = subfileName + '-' + name;

			// create the gulp task
			sandboxedGulp.task(subname, subtask);

			// retrieve the taskWrapper
			var newtask = sandboxedGulp.registry().get(subname);

			// add it to the list of functions the master task will call
			if (master[name])
				master[name].push(newtask)
			else
				master[name] = [ newtask ];
		});
	});

	sandboxedGulp = new gulp.Gulp();

	// generate the master tasks
	_.each(master, function(subtasks, name) {
		if (subtasks.length == 1)
			sandboxedGulp.task(name, subtasks[0]);
		else
			sandboxedGulp.task(name, gulp.series(subtasks));
	})

	this._tasks = sandboxedGulp.registry().tasks();
};

/**
 * Registry API
 * Register a task
 *
 * @param {string} name - the name of the task
 * @param {function} fn - the task function
 */
HubRegistry.prototype.set = function (name, fn) {
	// TODO: what if this collides with a master task?
	ForwardRegistry.prototype.set.call(this, name, fn);
	this._registry[this._callsite].set(name, fn);
};

module.exports = HubRegistry;
