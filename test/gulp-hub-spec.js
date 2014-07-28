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

    it( 'resolves glob pattern to a list of files', function () {
        var pdeps = { glob: { sync: sinon.spy( HAPPY_PROXY_DEPS.glob.sync ) } };
        var hub = getHub( pdeps );

        var spy = pdeps.glob.sync;
        var globOpts = { 'nosort': true };

        hub( 'single-glob-pattern' );
        spy.calledOnce.should.be.true;
        spy.calledWith( 'single-glob-pattern', globOpts ).should.be.true;

        spy.reset();

        hub( [ 'array-with-one-element' ] );
        spy.calledOnce.should.be.true;
        spy.calledWith( 'array-with-one-element', globOpts ).should.be.true;

        spy.reset();

        hub( [ 'array', 'with', 'more', 'than', 'one', 'element' ] );
        spy.calledOnce.should.be.true;
        spy.calledWith( '{array,with,more,than,one,element}', globOpts ).should.be.true;
    } );

    it( 'loads all specified gulpfiles' );

    it( 'creates a gulp task tree' );

} );
