'use strict';

var gulp = require('gulp');
var HubRegistry = require('../../');

/* load some files into the registry */
var hub = new HubRegistry(['tasks/*.js']);

/* tell gulp to use the tasks just loaded */
gulp.registry(hub);
