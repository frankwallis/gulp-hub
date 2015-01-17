var path = require('path');
var _       = require( 'lodash' );
var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' );

var HubRegistry = require('../lib/hub-registry');

// Happy-path proxyquire dependencies, i.e., dependencies that will allow
// gulp-hub to complete without errors
var HAPPY_PROXY_DEPS = {
    'gulp-util': {
        log:    _.noop,
        colors: { yellow: _.noop }
    },
    './resolve-glob': function () { return [] },
    './load-subfile': function () { return HAPPY_PROXY_DEPS.gulp },
    'gulp': {
        'registry': _.noop
    }
};

// Proxyquire gulp-hub, optionally extending the happy-path proxy dependencies
var getHub = function ( proxyDeps ) {
    return pequire( '../lib/index', _.assign( {}, HAPPY_PROXY_DEPS, proxyDeps ) );
};

describe( 'index', function () {

    it('is a function', function () {
        getHub().should.be.an.instanceOf( Function );
    });

    it('resolves a glob pattern to a file list', function () {
        var resolveGlobSpy = sinon.spy(function() { return []; });
        var hub = getHub( { './resolve-glob': resolveGlobSpy } );
        hub( 'test-pattern' );
        resolveGlobSpy.calledOnce.should.be.true;
        resolveGlobSpy.calledWith('test-pattern', __dirname).should.be.true;
    });

    it('logs each file it loads, path in yellow', function () {
        var logSpy = sinon.spy();
        var colorSpy = sinon.spy( function ( s ) { return 'yellow-' + s } );

        var hub = getHub( {
            'gulp-util': {
                log:    logSpy,
                colors: { yellow: colorSpy }
            },
            './resolve-glob': function () { return [ 'abs-path-1', 'abs-path-2' ]; }
        });

        hub( 'test-pattern' );

        logSpy.calledTwice.should.be.true;
        logSpy.calledWith( 'Loading', 'yellow-abs-path-1' ).should.be.true;
        logSpy.calledWith( 'Loading', 'yellow-abs-path-2' ).should.be.true;

        colorSpy.calledTwice.should.be.true;
        colorSpy.calledWith( 'abs-path-1' ).should.be.true;
        colorSpy.calledWith( 'abs-path-2' ).should.be.true;
    });

    it('loads each subfile', function () {
        var loadSpy = sinon.spy(function() { return HAPPY_PROXY_DEPS.gulp });
        var hub = getHub( {
            './resolve-glob': function () { return [ 'abs-path-1', 'abs-path-2' ]; },
            './load-subfile': loadSpy
        });
        hub( 'test-pattern' );
        loadSpy.calledTwice.should.be.true;
        loadSpy.calledWith( 'abs-path-1' ).should.be.true;
        loadSpy.calledWith( 'abs-path-2' ).should.be.true;
    });

    it('transfers tasks from existing subfile', function () {
        var regSpy = sinon.spy(function(a) { return {}; });
        var hub = getHub( {
            './resolve-glob': function () { return [ 'abs-path-1', 'abs-path-2' ]; },
            'gulp': {
                registry: regSpy
            }
        });
        hub( 'test-pattern' );
        regSpy.calledTwice.should.be.true;
        regSpy.calledWith().should.be.true;
    });

});
