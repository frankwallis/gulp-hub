var _       = require( 'lodash' );
var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' ).noCallThru();
var tutil   = require( './lib/test-util' );

var HAPPY_PROXY_DEPS = {
    gulp:            { Gulp:           _.noop },
    './hub-util':    { isValidHubFile: function (){ return true } },
    './add-subtask': _.noop
};

var getLoad = function ( proxyDeps ) {
    return pequire( '../lib/load-subfile', _.assign( {}, HAPPY_PROXY_DEPS, proxyDeps ) );
};

describe( 'load-subfile', function () {

    it( 'errors if subfile is not a valid Gulp Hub file', function () {
        var loadSubfile = getLoad( {
            './hub-util': {
                isValidHubFile: function () { return false }
            }
        } );
        loadSubfile.should.throw( '`subfile` must be a valid Gulp Hub file object.' );
    } );

    it( 'errors if the task registry is not an object', function () {
        var loadSubfile = getLoad();
        tutil.getTypeExamples( _.isPlainObject ).forEach( function ( testTasksParam ) {
            loadSubfile.bind( null, null, testTasksParam ).should.throw( '`task` must be an object' );
        } );
    } );

    // TODO: Implement these specs. I'm not sure exactly how to test these
    // specs as the current implementation involves the `require`, `module`
    // objects which are local to each script. - @robatron

    it( 'proxies `gulp.task` to our add-subtask' );

    it( '`require`s the specified file' );

    it( 'adds tasks from the local gulpfile' );
} );
