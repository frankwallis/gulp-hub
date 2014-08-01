/**
 * Test utilities.
 */
var _ = require( 'lodash' );

/**
 * Return an array of example JavaScript types including String, Number,
 * Boolean, Object, Array, Null, Undefined[1].
 *
 * Exclude a type example by providing a validation function, e.g.,
 * getTypeExamples( _.isArray ) will return all type examples except arrays[2].
 *
 * [1] http://msdn.microsoft.com/en-us/library/ie/7wkd9z69(v=vs.94).aspx
 * [2] http://lodash.com/docs
 *
 * @param {[function]} excludeFunc - Validation function for the type you wish to exclude
 */
module.exports.getTypeExamples = function ( excludeFunc ) {

    // Examples of each
    var ALL_TYPE_EXAMPLES = [
        '', 'a', 0, 1, false, true, {}, { a: 1 }, [], [ 'a' ], null, undefined
    ];

    // If no exclusions, return all type examples
    if ( _.isUndefined( excludeFunc ) || !_.isFunction( excludeFunc ) ) {
        return ALL_TYPE_EXAMPLES;
    }

    // Otherwise, remove the specified exclude type from the type examples
    var typeExamples = _.remove( ALL_TYPE_EXAMPLES, function ( el ) {
        return !excludeFunc( el );
    } );

    return typeExamples;
};
