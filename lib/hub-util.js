/**
 * Gulp Hub utility module
 */

/**
 * Returns true if `file` is a valid gulp-hub file object.
 *
 * @param file - The variable to test
 * @return - True if the variable is a gulp-hub object, false if not
 */
module.exports.isValidHubFile = function (file) {
    if (
        typeof file === 'object' && file !== null && !Array.isArray(file) &&
        file.relativePath && typeof file.relativePath === 'string' &&
        file.absolutePath && typeof file.absolutePath === 'string' &&
        file.uniqueName   && typeof file.uniqueName   === 'string'
    ){
        return true;
    }
    return false;
};
