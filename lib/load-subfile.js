/*
 * gulp-hub
 * https://github.com/frankwallis/gulp-hub
 *
 * Copyright (c) 2014 Frank Wallis
 * Licensed under the MIT license.
 */
var Module = require('module');
var gulp = require('gulp');

/**
 * Load the gulp file and return the registry of the gulp instance it used
 *
 * @param {string} path - the path of the subfile
 * @returns {object} registry - The registry of tasks created by the loaded gulpfile
 */
module.exports = function(subfile) {
   var originalLoader = Module._load;
   var sandboxedGulp = new gulp.Gulp();

   Module._load = function(request, parent) {
      if (request == 'gulp')
         return sandboxedGulp;
      else
         return originalLoader.apply(this, arguments);
   };

   require(subfile);

   Module._load = originalLoader;
   return sandboxedGulp.registry();
};
