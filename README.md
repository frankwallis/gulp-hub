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
    hub(['./project1/gulpfile.js', './project2/gulpfile.js']);
    ```

3. Run `gulp [taskname]`

Gulp-hub will execute that task in all of the gulpfiles.

* If there are tasks in the gulp file that don't depend on hub files, you may exclude them like this:

    ```js
    var options = {
        excludedTasks: ['taskA', 'taskB']
    };
    hub(['./project1/gulpfile.js', './project2/gulpfile.js'], options);
    gulp('taskA', function(){/*task to run*/});
    gulp('taskB', function(){/*task to run*/});
    ```
When you call gulp with taskA or taskB, the hub function will not generate all the hub tasks. 
This is useful if you have a cleanup task and hub loads gulpfiles with cleaned node packages. 
