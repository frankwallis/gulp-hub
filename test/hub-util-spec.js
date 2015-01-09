var _      = require( 'lodash' );
var should = require( 'should' );
var tutil  = require( './lib/test-util' );

describe( 'hub-util', function () {
    var hutil = require('../lib/hub-util');

    describe( 'isValidHubFile', function () {
        var isValidHubFile = hutil.isValidHubFile;
        var EXPECTED_PROPS = [ 'absolutePath', 'relativePath', 'uniqueName' ];
        var VALID_FILE = { absolutePath: 'a', relativePath: 'r', uniqueName: 'r' };

        it( 'returns true if the file is a valid gulp-hub file', function () {
            isValidHubFile( VALID_FILE ).should.be.true;
        } );

        it( 'returns false if not a plain object', function () {
            tutil.getTypeExamples( _.isPlainObject ).forEach( function ( type ) {
                isValidHubFile( type ).should.be.false;
            } );
        } );

        it( 'returns false if missing properties', function () {
            EXPECTED_PROPS.forEach( function ( prop ) {
                var missingProp = _.omit( VALID_FILE, prop );
                isValidHubFile( missingProp ).should.be.false;
            } );
        } );

        it( 'returns false if properties are not strings', function () {
            tutil.getTypeExamples( _.isString ).forEach( function ( type ) {
                EXPECTED_PROPS.forEach( function ( prop ) {
                    var testFile = _.assign( {}, VALID_FILE );
                    testFile[ prop ] = type;
                    isValidHubFile( testFile ).should.be.false;
                } );
            } );
        } );
    } );
} );
