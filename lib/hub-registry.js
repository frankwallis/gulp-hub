var gulp = require('gulp');
var _ = require('lodash');

function HubRegistry() {
  if (!(this instanceof HubRegistry))
    return new HubRegistry()

  this._tasks = {};
  this._registry = {};
}

HubRegistry.prototype.setCurrentSubfile = function (name) {
	this._currentSubfile = name;
};

HubRegistry.prototype.resetCurrentSubfile = function () {
	this._currentSubfile = undefined;
};

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

HubRegistry.prototype.getSubname = function (subfile, name) {
	return subfile + '-' + name;
};

/* 
  Registry API
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

HubRegistry.prototype.tasks = function () {
  var self = this;

  return _.keys(this._tasks).reduce(function(tasks, name) {
    tasks[name] = self.get(name);
    return tasks;
  }, {});	
};

module.exports = HubRegistry;
