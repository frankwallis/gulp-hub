gulp-hub
========

Gulp extension to run tasks from multiple gulpfiles

Usage:

1) npm install gulp gulp-hub

2) Create a gulpfile.js which looks like this:
```
var hub = require('gulp-hub');
hub('**/gulpfile.js');
```
3) run 'gulp <taskname>'

TODO:
- Fix the glob pattern to match gulp (string|Array)
- Make the assigned unique names more descriptive
- Enable dependencies between gulpfiles
