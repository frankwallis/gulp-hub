var path = require('path');
var glob = require( 'glob' );

/**
 * Resolves a gulp-like glob pattern,
 * https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpsrcglobs-options,
 * to a minimatch glob string, https://github.com/isaacs/minimatch
 * 
 * @param {string|array} pattern - A glob or an array of globs
 * @returns - An array of files matched by the glob
 */
module.exports = function(pattern, rootDir) {
    if (Array.isArray(pattern)) {
        if (pattern.length === 1)
            pattern = pattern[0];
        else
            pattern = '{' + pattern.join(',') + '}';
    }

    return glob.sync(pattern, { "nosort": true, "cwd": rootDir })
}
