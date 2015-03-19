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
var gulp = require('gulp');
var gutil = require('gulp-util');

var DefaultRegistry = require('undertaker-registry');
var resolveGlob = require('./resolve-glob');
var loadSubfile = require('./load-subfile');

function HubRegistry(pattern) {
	if (!(this instanceof HubRegistry))
		return new HubRegistry(pattern);

	this._registry = {};
	this._callsite = this.getCallSite();

	// resolve the list of gulpfiles
	var gulpfiles = resolveGlob(pattern, path.dirname(this._callsite));

	// load the subfiles into the registry map
	var self = this;
	gulpfiles.forEach(function(gulpfile) {
		gutil.log('Loading', gutil.colors.yellow(gulpfile));
		self._registry[gulpfile] = loadSubfile(gulpfile);
	});

	// setup an internal subfile in case tasks are added from the existing registry
	this._registry[this._callsite] = new DefaultRegistry();
}

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
 * Generate our tasks from all the subfile registries
 */
HubRegistry.prototype.getTasks = function() {
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
			var newtask = sandboxedGulp.registry().get(subname, subtask);

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
		sandboxedGulp.task(name, gulp.series(subtasks));
	})

	return sandboxedGulp.registry().tasks();
};

/**
 * Registry API
 * Get a registered task
 *
 * @param {string} name - the name of the task
 * @returns {function} fn - the task function
 */
HubRegistry.prototype.get = function (name) {
	return this.tasks()[name];
};

/**
 * Registry API
 * Register a task
 *
 * @param {string} name - the name of the task
 * @param {function} fn - the task function
 */
HubRegistry.prototype.set = function (name, fn) {
	this._registry[this._callsite].set(name, fn);
};

/**
 * Registry API
 * Returns a new map containing all of the registered tasks
 *
 * @returns  {object} tasks - A map of the tasks
 */
HubRegistry.prototype.tasks = function () {
	return this.getTasks();
};


module.exports = HubRegistry;
