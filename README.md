gulp-hub
========

Gulp extension to run tasks from multiple gulpfiles

Usage:

1) npm install gulp gulp-hub

2) Create a gulpfile.js which looks like this:
```
var hub = require('gulp-hub');
hub('./project*/gulpfile.js');
```
3) run 'gulp [taskname]'

gulp-hub will execute that task in all of the gulpfiles