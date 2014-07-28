var _       = require( 'lodash' );
var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' );

describe( 'gulp-hub', function () {

    before( function () {
        this.getTestModule = function () {
            return pequire( '../lib/index', {} );
        };
    } );

    beforeEach( function () {
        this.testModule = this.getTestModule();
    } );

    it( 'is a function', function () {
        this.testModule.should.be.an.instanceOf( Function );
    } );

    it( 'takes a glob or an array of globs', function () {
        var hub = this.testModule;
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

    it( 'loads all specified gulpfiles' );

    it( 'creates a gulp task tree' );

} );
