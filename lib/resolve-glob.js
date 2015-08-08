/*
 * gulp-hub
 * https://github.com/frankwallis/gulp-hub
 *
 * Copyright (c) 2014 Frank Wallis
 * Licensed under the MIT license.
 */
var path = require('path');
var glob = require( 'glob');
var _ = require('lodash');

/**
 * Resolves a gulp-like glob pattern,
 * https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpsrcglobs-options,
 * to a minimatch glob string, https://github.com/isaacs/minimatch
 *
 * @param {string|array} pattern - A glob or an array of globs
 * @param {string} rootDir - The directory to start the search (defaults to process.cwd())
 * @returns - An array of absolute pathnames matched by the glob
 */
module.exports = function(pattern, rootDir) {
   // assert `pattern` is a valid glob (non-empty string) or array of globs
   var isString = _.isString(pattern);
   var isArray = _.isArray(pattern);

   if ((!isString && !isArray) || (pattern.length === 0)) {
      throw new TypeError('A glob pattern or an array of glob patterns is required.');
   }

   // make the pattern into a single string
   if (isArray) {
      if (pattern.length === 1)
      	pattern = pattern[0];
      else
      	pattern = '{' + pattern.join(',') + '}';
   }

   // default rootDir if not set
   rootDir = rootDir || process.cwd();

   // resolve the files to absolute paths
   return glob.sync(pattern, { "nosort": true, "cwd": rootDir })
      .map(function(filename) {
         return path.join(rootDir, filename);
      });
}
