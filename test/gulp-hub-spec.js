var _       = require( 'lodash' );
var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' );

// Happy-path proxyquire dependencies, i.e., dependencies that will allow
// gulp-hub to complete without errors
var HAPPY_PROXY_DEPS = {
    glob: {
        sync: function () { return [] },
    },
    './resolve-glob': _.noop,
    './get-subfiles': function () { return [] },
    './load-subfile': _.noop,
    './add-task': _.noop
};

// Proxyquire gulp-hub, optionally extending the happy-path proxy dependencies
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

    it( 'resolves a glob pattern to a file list', function () {
        var resolveGlobSpy = sinon.spy();
        var hub = getHub( { './resolve-glob': resolveGlobSpy } );
        hub( 'test-pattern' );
        resolveGlobSpy.calledOnce.should.be.true;
        resolveGlobSpy.calledWith( 'test-pattern' );
    } );

    it( 'creates a list of Gulp Hub files from a file list', function () {
        var spy = sinon.spy( HAPPY_PROXY_DEPS[ './get-subfiles' ] );
        var hub = getHub( {
            './resolve-glob': function () { return 'resolve-glob-return' },
            './get-subfiles': spy
        } );
        hub( 'test-pattern' );
        spy.calledOnce.should.be.true;
        spy.calledWith( 'resolve-glob-return' ).should.be.true;
    } );

    it( 'logs each file it loads' );

    it( 'loads each subfile' );

    it( 'adds each discovered task' );
} );
