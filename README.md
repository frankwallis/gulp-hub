# [gulp](http://gulpjs.com/)-hub

> Gulp extension to run tasks from multiple gulpfiles.

Usage:

1. Install gulp-hub:

    ```sh
    $ npm install gulp gulp-hub
    ```

2. Create a gulpfile.js which looks like this:

    ```js
    var hub = require('gulp-hub');
    hub('./project*/gulpfile.js');
    ```

3. Run `gulp [taskname]`

Gulp-hub will execute that task in all of the gulpfiles.
