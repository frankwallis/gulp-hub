var path = require('path');
var _ = require('lodash');

/**
 * Load the gulp file and return the gulp instance it used
 *
 * @param {string} path - the path of the subfile
 * @returns {object} inst - The gulp instance used by the loaded subfile
 */
module.exports = function(subfile) {
    require(subfile);

    var submodule = findModule(function(mod) {
        return (mod.id === subfile);
    });

    var gulpMod = findModule(function(mod) {
        return (path.basename(path.dirname(mod.id)) === 'gulp');
    }, submodule);

    return gulpMod.exports;
};

/**
 * Gets the required module recursively
 *
 * @param  {function} pred - a predicate function to match the module being searched for
 * @returns  {object} parent - The parent module to start from
 */
function findModule(pred, parent) {
    parent = parent || module;
    var result = _.find(parent.children, pred);
    return result ? result : parent.parent ? findModule(pred, parent.parent) : undefined;
}