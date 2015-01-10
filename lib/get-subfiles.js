var path = require( 'path' );

/**
 * Given a list of file paths, return a list of objects representing each file's
 * relative path, absolute path, and unique name. (The unique name is just the
 * relative path for now.)
 * 
 * @param {array} filelist - A list of file paths
 * @returns - An array of objects containing each file's absolute path, relative path, and a unique name
 * @example
 *     > var getSubfiles = require('./get-subfiles');
 *     > getSubfiles(['b/c.js', '2/3.js']);
 *     [
 *         {
 *             relativePath: b/c.js,
 *             absolutePath: /a/b/c.js,
 *             uniqueName:   b/c.js
 *         },
 *         {
 *             relativePath: 2/3.js,
 *             absolutePath: /1/2/3.js,
 *             uniqueName:   2/3.js
 *         }
 *     ]
 */
module.exports = function(filelist) {

    if(!Array.isArray(filelist)) {
        throw new TypeError( 'An array of file paths is required.' );
    }

    var subfiles = [];

    filelist.forEach(function (file) {
        var subfile = {};

        subfile.relativePath = file;
        subfile.absolutePath = path.resolve(file);

        // a subfile's unique name is just its relative path
        subfile.uniqueName = subfile.relativePath;

        subfiles.push(subfile);
    });

    return subfiles;
};
