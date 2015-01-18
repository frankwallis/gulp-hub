# gulp-hub

> [Gulp](http://gulpjs.com/) extension to run tasks from multiple gulpfiles.

[![build status](https://secure.travis-ci.org/frankwallis/gulp-hub.png?branch=4.0)](http://travis-ci.org/frankwallis/gulp-hub)

Basic Usage:

1. Install gulp-hub:

    ```sh
    $ npm install gulp-hub
    ```

2. Create a gulpfile.js which looks like this:

    ```js
    var gulp = require('gulp');
    var HubRegistry = require('gulp-hub');

    /* load some gulpfiles into the registry */
    var hub = new HubRegistry(['./project1/gulpfile.js', './project1/gulpfile.js']);

    /* tell gulp to use the tasks just loaded */
    gulp.registry(hub);
    ```

3. Run `gulp [taskname]`

Gulp will execute [taskname] in all of the gulpfiles.

More Details:

HubRegistry constructor accepts glob patterns.
Tasks registered in the same gulpfile from which gulp-hub is called will be included.
If one of the child gulpfiles also uses HubRegistry then that is handled too.

Use gulp --tasks to view the task tree:
   ```sh
   gulp --tasks

   gulp-hub/examples$ gulp --tasks
   [15:56:21] Loading /Users/frank/work/gulp-hub/examples/project1/gulpfile.js
   [15:56:21] Loading /Users/frank/work/gulp-hub/examples/project1/project1A/gulpfile.js
   [15:56:21] Loading /Users/frank/work/gulp-hub/examples/project1/project1B/gulpfile.js
   [15:56:21] Loading /Users/frank/work/gulp-hub/examples/project2/gulpfile.js
   [15:56:21] Tasks for ~/work/gulp-hub/examples/gulpfile.js
   [15:56:21] ├─┬ build
   [15:56:21] │ └─┬ <series>
   [15:56:21] │   ├─┬ /Users/frank/work/gulp-hub/examples/project1/gulpfile.js-build
   [15:56:21] │   │ └─┬ build
   [15:56:21] │   │   └─┬ <series>
   [15:56:21] │   │     ├─┬ /Users/frank/work/gulp-hub/examples/project1/project1A/gulpfile.js-build
   [15:56:21] │   │     │ └─┬ build
   [15:56:21] │   │     │   └─┬ <series>
   [15:56:21] │   │     │     ├── precompile
   [15:56:21] │   │     │     └── compile1A
   [15:56:21] │   │     ├─┬ /Users/frank/work/gulp-hub/examples/project1/project1B/gulpfile.js-build
   [15:56:21] │   │     │ └─┬ build
   [15:56:21] │   │     │   └─┬ <series>
   [15:56:21] │   │     │     ├── precompile
   [15:56:21] │   │     │     └── compile
   [15:56:21] │   │     └─┬ /Users/frank/work/gulp-hub/examples/project1/gulpfile.js-internal-build
   [15:56:21] │   │       └─┬ build
   [15:56:21] │   │         └─┬ <series>
   [15:56:21] │   │           ├── precompile
   [15:56:21] │   │           └── compile
   [15:56:21] │   ├─┬ /Users/frank/work/gulp-hub/examples/project2/gulpfile.js-build
   [15:56:21] │   │ └─┬ build
   [15:56:21] │   │   └─┬ <series>
   [15:56:21] │   │     ├── precompile
   [15:56:21] │   │     └── compile
   [15:56:21] │   └─┬ /Users/frank/work/gulp-hub/examples/gulpfile.js-internal-build
   [15:56:21] │     └─┬ build
   [15:56:21] │       └─┬ <series>
   [15:56:21] │         ├── precompile
   [15:56:21] │         └── compile
   ```

See the example project for more advanced examples.
