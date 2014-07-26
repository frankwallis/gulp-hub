var _       = require( 'lodash' );
var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' );

var INVALID_VALUES = [ '', 0, 1, true, false, [], {}, { a: 'foo' }, null, undefined ];

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

    it( 'takes one argument: A non-empty glob (string) or an array', function () {
        var hub = this.testModule;

        INVALID_VALUES.forEach( function ( testValue ) {
            hub.bind( null, testValue ).should.throw(
                'A non-empty glob pattern or array of glob patterns is required.'
            );
        } );

        hub( 'ok' );
    } );

    it( 'loads all specified gulpfiles' );

    it( 'creates a gulp task tree' );

} );
