/**
 * Test utilities.
 */
var _ = require( 'lodash' );

/**
 * Return an array of example JavaScript types including String, Number,
 * Boolean, Object, Array, Null, Undefined[1].
 *
 * Exclude a type example by specifying it as a string. Must match one of the
 * _.is*` validation functions in lodash[2].
 *
 * [1] http://msdn.microsoft.com/en-us/library/ie/7wkd9z69(v=vs.94).aspx
 * [2] http://lodash.com/docs
 *
 * @param {[string]} excludeType - Type to exclude from the returned list. Must
 *     match of of lodash's `_.is*` functions.
 */
module.exports.getTypeExamples = function ( excludeType ) {

    // Examples of each
    var ALL_TYPES = [
        '', 'a', 0, 1, false, true, {}, { a: 1 }, [], [ 'a' ], null, undefined
    ];

    // If no exclusions, return all type examples
    if ( _.isUndefined( excludeType ) ) return ALL_TYPES;

    // Get prospective lodash validation funciton name from `excludeType`, e.g.,
    // 'string' -> 'isString'
    var validator = _[ 'is' +                     // First word "is"
        excludeType.slice( 0, 1 ).toUpperCase() + // Type word: 1st letter uppercase
        excludeType.slice( 1 )
    ];

    // If lodash validation funciton does not exist, return all type examples
    if ( _.isUndefined( validator ) ) return ALL_TYPES;

    // Otherwise, remove the specified exclude type from the type examples
    return _.remove( ALL_TYPES, function ( el ) { return !validator( el ) } );
}
