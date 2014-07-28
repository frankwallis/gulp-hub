var _       = require( 'lodash' );
var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' );

// Happy-path proxyquire dependencies, i.e., dependencies that will allow gulp-
// hub to complete without errors
var HAPPY_PROXY_DEPS = {
    glob: {
        sync: function () { return [] }
    }
};

// Proxyquire a gulp-hub object, optionally extending the happy path dependencies
var getHub = function ( proxyDeps ) {
  return pequire( '../lib/index', _.assign( {}, HAPPY_PROXY_DEPS, proxyDeps ) );
};

describe( 'gulp-hub', function () {

    it( 'is a function', function () {
        getHub().should.be.an.instanceOf( Function );
    } );

    it( 'takes a glob or an array of globs', function () {
        var hub = getHub();
        var INVALID_VALUES = [ '', 0, 1, true, false, [], {}, { a: 'foo' }, null, undefined ];

        // Assert we get an error for invalid values
        INVALID_VALUES.forEach( function ( testValue ) {
            hub.bind( null, testValue ).should.throw(
                'A glob pattern or an array of glob patterns is required.'
            );
        } );

        // Assert we don't get an error for a valid glob (non-empty string)
        hub.bind( null, 'ok' ).should.not.throw();
    } );

} );
