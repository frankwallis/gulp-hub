var path = require('path');
var _       = require('lodash');
var gulp    = require('gulp');
var should  = require('should');
var sinon   = require('sinon');
var pequire = require('proxyquire');
var DefaultRegistry = require('undertaker-registry');
var HubRegistry = require('../lib/');

var registry = gulp.registry();

// Happy-path proxyquire dependencies, i.e., dependencies that will allow
// gulp-hub to complete without errors
var HAPPY_PROXY_DEPS = {
   '_': _,
   'path': path,
   'undertaker-registry': DefaultRegistry,
   'gulp-util': {
      log:    _.noop,
      colors: { yellow: _.noop }
   },
   './resolve-glob': function () { return [] },
   './load-subfile': function () { return registry }
};

// Proxyquire gulp-hub, optionally extending the happy-path proxy dependencies
var getHubRegistry = function ( proxyDeps ) {
   return pequire( '../lib/hub-registry', _.assign( {}, HAPPY_PROXY_DEPS, proxyDeps ) );
};

describe( 'HubRegistry', function () {

   it('is a constructor function', function () {
      var HubRegistry = getHubRegistry();
      HubRegistry.should.be.an.instanceOf(Function);
      HubRegistry().should.be.an.instanceOf(HubRegistry);
      new HubRegistry().should.be.an.instanceOf(HubRegistry);
   });

   it('resolves a glob pattern to a file list', function () {
      var resolveGlobSpy = sinon.spy(function() { return []; });
      var HubRegistry = getHubRegistry( { './resolve-glob': resolveGlobSpy } );
      var hub = new HubRegistry( 'test-pattern' );
      resolveGlobSpy.calledOnce.should.be.true;
      resolveGlobSpy.calledWith('test-pattern', __dirname).should.be.true;
   });

   it('logs each file it loads, path in yellow', function () {
      var logSpy = sinon.spy();
      var colorSpy = sinon.spy( function ( s ) { return 'yellow-' + s } );

      var HubRegistry = getHubRegistry( {
         'gulp-util': {
            log:    logSpy,
            colors: { yellow: colorSpy }
         },
         './resolve-glob': function () { return [ 'abs-path-1', 'abs-path-2' ]; }
      });

      var hub = new HubRegistry( 'test-pattern' );
      hub.init(gulp);

      logSpy.calledTwice.should.be.true;
      logSpy.calledWith( 'Loading', 'yellow-abs-path-1' ).should.be.true;
      logSpy.calledWith( 'Loading', 'yellow-abs-path-2' ).should.be.true;

      colorSpy.calledTwice.should.be.true;
      colorSpy.calledWith( 'abs-path-1' ).should.be.true;
      colorSpy.calledWith( 'abs-path-2' ).should.be.true;
   });

   it('loads each subfile', function () {
      var loadSpy = sinon.spy(function() { return HAPPY_PROXY_DEPS['./load-subfile']() });
      var HubRegistry = getHubRegistry( {
         './resolve-glob': function () { return [ 'abs-path-1', 'abs-path-2' ]; },
         './load-subfile': loadSpy
      });
      var hub = new HubRegistry( 'test-pattern' );
      hub.init(gulp);
      loadSpy.calledTwice.should.be.true;
      loadSpy.calledWith( gulp, 'abs-path-1' ).should.be.true;
      loadSpy.calledWith( gulp, 'abs-path-2' ).should.be.true;
   });

   it('doesnt use gulp.series if there is only one file', function () {
      var loadSpy = sinon.spy(function() { return HAPPY_PROXY_DEPS['./load-subfile'](); });
      var HubRegistry = getHubRegistry( {
         './resolve-glob': function () { return [ 'abs-path-1', 'abs-path-2' ]; },
         './load-subfile': loadSpy
      });
      var hub = new HubRegistry( 'test-pattern' );
      hub.init(gulp);
      loadSpy.calledTwice.should.be.true;
      loadSpy.calledWith( gulp, 'abs-path-1' ).should.be.true;
      loadSpy.calledWith( gulp, 'abs-path-2' ).should.be.true;
   });

});
