/*
* gulp-hub
* https://github.com/frankwallis/gulp-hub
*
* Copyright (c) 2014 Frank Wallis
* Licensed under the MIT license.
*/
/// <reference path="../definitions/node/node.d.ts" />
/// <reference path="../definitions/through/through.d.ts" />
var gutil = require('gulp-util');
var through = require('through2');
var gulp = require('gulp');
var proxyquire = require('proxyquire');

var filelist = [];
var tasks = {};

function eachFile(file, encoding, done) {
    var _stream = this;
    console.log('here');

    if (file.isNull()) {
        _stream.emit('error', new gutil.PluginError('gulp-hub', 'file is null'));
        _stream.push(file);
        return done();
    }

    if (file.isStream()) {
        _stream.emit('error', new gutil.PluginError('gulp-hub', 'Streaming not supported'));
        return done();
    }

    console.log('Received ' + file.relative);

    //console.log('Received ' + JSON.stringify(file));
    filelist.push(file.path);
    return done();
}

function endStream(done) {
    gutil.log(gutil.colors.yellow('Loaded ' + filelist.length + ' gulpfile(s)'));

    if (filelist.length === 0) {
        return done();
    }

    var originalTaskFn = gulp.Gulp.prototype.task;

    filelist.forEach(function (file, idx) {
        var directory = '';

        gulp.Gulp.prototype.task = function (name, deps, task) {
            addSubtask(directory, idx, name, deps, task);
        };

        proxyquire(file,{
			gulp:gulp
		});
    });

    gulp.Gulp.prototype.task = originalTaskFn;

    for (var name in tasks) {
        if (tasks.hasOwnProperty(name)) {
            var task = tasks[name];

            task.subtasks.forEach(function (subtask) {
                return gulp.add(subtask.name, subtask.deps, subtask.fn);
            });

            // create the master task which is dependent on all of the subtasks
            gulp.add(name, task.subtasks.map(function (subtask) {
                return subtask.name;
            }));
        }
    }


    return done();
}

function addSubtask(directory, idx, name, deps, task) {
    console.log('adding task ' + name);

    if (!tasks[name]) {
        tasks[name] = {};
        tasks[name].subtasks = [];
    }

    var subname = name + idx;
    var subdeps = deps;

    if (Array.isArray(deps))
        subdeps = deps.map(function (dep) {
            return dep + idx;
        });

    tasks[name].subtasks.push({ name: subname, directory: directory, deps: subdeps, fn: task });
}

function hub(glob) {
    console.log('here ' + glob);

    //gulp.src(glob).pipe(through.obj(eachFile, endStream));
    gulp.src(glob).pipe(through.obj(function () {
        console.log('hello');
    }, endStream)).on('data', function () {
    });
}

module.exports = hub;
//# sourceMappingURL=index.js.map
