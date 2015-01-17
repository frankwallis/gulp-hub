var gulp = require('gulp');
var _ = require('lodash');

function HubRegistry() {
  if (!(this instanceof HubRegistry))
    return new HubRegistry()

  this._tasks = {};
  this._registry = {};
}

/**
 * Set the name of the subfile currently being loaded
 *
 * @param {object} name - the namr of the subfile
 */
HubRegistry.prototype.setCurrentSubfile = function (name) {
	this._currentSubfile = name;
};

/**
 * Clear the name of the subfile currently being loaded
 */
HubRegistry.prototype.resetCurrentSubfile = function () {
	this._currentSubfile = undefined;
};

/**
 * Called after loading a subfile to create the required tasks
 */
HubRegistry.prototype.flushPendingTasks = function() {
	var self = this;

	// create new subtasks
	_.each(self._registry, function(master, name) {
		_.each(master, function(fn, subname) {
			if (!self._tasks[subname])
				gulp.task(subname, fn);
		})
	});

	// recreate all the master tasks
	_.each(self._registry, function(master, name) {
		var fns = _.keys(master).map(function(subname) {
			return self._tasks[subname];
		});
		gulp.task(name, gulp.series(fns));
	});
};

/**
 * Get a unique name for a subtask
 *
 * @param {string} subfile - the path of the subfile
 * @param {string} name - the name of the task
 * @param {string} subname - the name of the subtask
 */
HubRegistry.prototype.getSubname = function (subfile, name) {
	return subfile + '-' + name;
};

/**
 * Registry API
 * Get a registered task
 *
 * @param {string} name - the name of the task
 * @returns {function} fn - the task function
 */
HubRegistry.prototype.get = function (name) {
 	if (this._currentSubfile) {
  		var subname = this.getSubname(this._currentSubfile, name);
		return this._registry[name][subname];
  	}
  	else {
  		return this._tasks[name];
  	}
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
  		var subname = this.getSubname(this._currentSubfile, name);

  		if (!this._registry[name])
			this._registry[name] = {};

		this._registry[name][subname] = fn;
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
