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

	// cache the original gulp registry so we can restore it later
	var originalRegistry = gulp.registry();
	this.resetRegistry(gulp);

	this._registry = {};
	this._callsite = this.getCallSite();

	// resolve the list of gulpfiles
	var gulpfiles = resolveGlob(pattern, path.dirname(this._callsite));

	// load the subfiles into the registry map
	var self = this;
	gulpfiles.forEach(function(gulpfile) {
		gutil.log('Loading', gutil.colors.yellow(gulpfile));
		self.loadGulpfile(gulpfile);
	});

	// generate the tasks
	this.invalidateTasks();

	// leave the gulp instance pointing at its original registry
	// in case the hub registry is not used
	this.resetRegistry(gulp);
	gulp.registry(originalRegistry);

	// setup an internal subfile for tasks which are added in the calling gulpfile
	this._currentSubfile = this._callsite + '-internal';
	this._registry[this._currentSubfile] = new DefaultRegistry();
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
 * Load the subfile and cache its task registry
 */
HubRegistry.prototype.loadGulpfile = function(subfile) {
	/* clear our gulp instance in case it is used by the subfile */
	this.resetRegistry(gulp);

	var gulpInst = loadSubfile(subfile);
	this._registry[subfile] = gulpInst.registry();

	/* clear the registry of that gulp instance in case the instance gets re-used by a later subfile */
	this.resetRegistry(gulpInst);
	this.resetRegistry(gulp);
}

/**
 * Resets a gulp instance with a fresh DefaultRegistry
 */
HubRegistry.prototype.resetRegistry = function(gulpInst) {
	var registry = new DefaultRegistry();
	gulpInst.registry(registry);
	registry._tasks = {}; // naughty
}

/**
 * Generate our tasks from all the subfile registries
 */
HubRegistry.prototype.invalidateTasks = function() {
	var self = this;
	var master = {};

	this.resetRegistry(gulp);

	// assign new, unique names to each of the subtasks,
	// this means recreating all the subtasks using gulp.task
	_.each(self._registry, function(subregistry, subfileName) {
		var subtasks = subregistry.tasks();

		_.each(subtasks, function(subtask, name) {
			var subname = subfileName + '-' + name;

			// create the gulp task
			gulp.task(subname, subtask);

			// retrieve the taskWrapper
			var newtask = gulp.registry().get(subname, subtask);

			// add it to the list of functions the master task will call
			if (master[name])
				master[name].push(newtask)
			else
				master[name] = [ newtask ];
		});
	});

	// clear the subtasks we just created from the registry
	this.resetRegistry(gulp);

	// generate the master tasks
	_.each(master, function(subtasks, name) {
		gulp.task(name, gulp.series(subtasks));
	})

	this._tasks = gulp.registry().tasks();
	this.resetRegistry(gulp);
};

/**
 * Registry API
 * Get a registered task
 *
 * @param {string} name - the name of the task
 * @returns {function} fn - the task function
 */
HubRegistry.prototype.get = function (name) {
	return this._tasks[name];
};

/**
 * Registry API
 * Register a task
 *
 * @param {string} name - the name of the task
 * @param {function} fn - the task function
 */
HubRegistry.prototype.set = function (name, fn) {
	if (this._currentSubfile) {
		this._registry[this._currentSubfile].set(name, fn);
		this.invalidateTasks();
	}
	else {
		this._tasks[name] = fn;
	}
};

/**
 * Registry API
 * Returns a new map containing all of the registered tasks
 *
 * @returns  {object} tasks - A map of the tasks
 */
HubRegistry.prototype.tasks = function () {
	var self = this;

	return _.keys(this._tasks).reduce(function(tasks, name) {
		tasks[name] = self.get(name);
		return tasks;
	}, {});
};

module.exports = HubRegistry;
