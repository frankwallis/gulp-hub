var path = require( 'path' );

/**
 * Collect and return each file's relative path, absolute path, and unique name,
 * which is just the relative path for now.
 * @param {array} filelist - An array of file paths
 * @returns - An array of objects containing each file's absolute path, relative path, and a unique name.
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
