/**
 * Gulp Hub utility module
 */
var _ = require( 'lodash' );

/**
 * Returns true if `file` is a valid gulp-hub file object.
 *
 * @param file - The variable to test
 * @return - True if the variable is a gulp-hub object, false if not
 */
module.exports.isValidHubFile = function (file) {
    if (
        _.isPlainObject( file ) &&
        file.relativePath && typeof file.relativePath === 'string' &&
        file.absolutePath && typeof file.absolutePath === 'string' &&
        file.uniqueName   && typeof file.uniqueName   === 'string'
    ){
        return true;
    }
    return false;
};
