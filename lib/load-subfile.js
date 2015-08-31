/*
 * gulp-hub
 * https://github.com/frankwallis/gulp-hub
 *
 * Copyright (c) 2014 Frank Wallis
 * Licensed under the MIT license.
 */
var Module = require('module');
var fwd = require('fwd');

/**
 * Load the gulp file and return the registry of the gulp instance it used
 *
 * @param {string} path - the path of the subfile
 * @returns {object} registry - The registry of tasks created by the loaded gulpfile
 */
module.exports = function(gulp, subfile) {
   var originalLoader = Module._load;
   var sandboxedGulp = new gulp.Gulp();

   // rediect the module loader
   Module._load = function(request, parent) {
      if (request == 'gulp')
         return sandboxedGulp;
      else
         return originalLoader.apply(this, arguments);
   };

   //load the subfile
   require(subfile);

   // restore the module loader
   Module._load = originalLoader;

   // forward emmited events to the parent gulp instance
   // this ensures that events emitted by gulp.series and
   // gulp.parallel are handled
   fwd(sandboxedGulp, gulp);

   // return the registry of tasks just loaded
   return sandboxedGulp.registry();
};
