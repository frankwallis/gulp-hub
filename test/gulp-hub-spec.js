var _       = require( 'lodash' );
var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' );

var TYPES = [ String, Number, Boolean, Object, Array, null, undefined ];

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

        var testPatterns = [];
        testPatterns.push( TYPES, 'ok' );
        testPatterns = _.flatten( testPatterns )

        testPatterns.forEach( function ( testPattern ) {
            if ( testPattern === 'ok' ) {
                hub.bind( null, testPattern ).should.not.throw();
            } else {
                hub.bind( null, testPattern ).should.throw(
                    'A non-empty glob pattern or array of glob patterns is required.'
                );
            }
        } );
    } );

    it( 'loads all specified gulpfiles' );

    it( 'creates a gulp task tree' );

} );
