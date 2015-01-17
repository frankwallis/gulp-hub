# gulp-hub

> [Gulp](http://gulpjs.com/) extension to run tasks from multiple gulpfiles.

[![build status](https://secure.travis-ci.org/frankwallis/gulp-hub.png?branch=master)](http://travis-ci.org/frankwallis/gulp-hub?branch=master)

Usage:

1. Install gulp-hub:

    ```sh
    $ npm install gulp gulp-hub
    ```

2. Create a gulpfile.js which looks like this:

    ```js
    var hub = require('gulp-hub');
    hub(['./project1/gulpfile.js', './project1/gulpfile.js']);
    ```

3. Run `gulp [taskname]`

Gulp-hub will execute that task in all of the gulpfiles.
