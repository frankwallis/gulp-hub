var should  = require( 'should' );

describe( 'get-subfiles', function () {

    it( 'requires an array of file paths', function () {
        var getSubfiles = require( '../lib/get-subfiles' );
        var INVALID_VALUES = [ '', 0, 1, true, false, {}, { a: 'foo' }, null, undefined ];

        // Assert we get an error for invalid values
        INVALID_VALUES.forEach( function ( testValue ) {
            getSubfiles.bind( null, testValue ).should.throw(
                'An array of file paths is required.'
            );
        } );

        // Assert we don't get an error for valid values
        getSubfiles.bind( null, [] ).should.not.throw();
    } );

} );
