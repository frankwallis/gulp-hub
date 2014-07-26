var _       = require( 'lodash' );
var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' );

var TYPES = [ String, Number, Boolean, Object, Array, null, undefined ];

var getHub = function ( overrides ) {
    overrides = _.assign( {}, overrides )
    return pequire( '../lib/index', overrides );
};

describe( 'gulp-hub', function () {

    it( 'is a function', function () {
        getHub().should.be.an.instanceOf( Function );
    } );

    it( 'takes one argument: A non-empty glob (string) or an array', function () {

        var hub = getHub();

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
