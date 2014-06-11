gulp-hub
========

Gulp extension to run tasks from multiple gulpfiles

Usage:

1) npm install gulp gulp-hub

2) Create a gulpfile.js which looks like this:
```
var hub = require('gulp-hub');
hub('./*/gulpfile.js');
```
3) run 'gulp [taskname]'

Notes:
- This requires that gulp is installed in the hub directory only
- It will also improve performance if other shared modules are only installed there

TODO:
- Fix the glob pattern to match gulp (string|Array)
- Improve the unique name algorithm
- Enable dependencies between gulpfiles
