var _       = require( 'lodash' );
var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' ).noCallThru();

var HAPPY_PROXY_DEPS = {
    gulp: {
        Gulp: _.noop
    },
    './hub-util': {
        isValidHubFile: function (){ return true }
    },
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
        var INVALID_VALUES = [ '', 0, 1, true, false, [], null, undefined ];
        INVALID_VALUES.forEach( function ( testTasksParam ) {
            loadSubfile.bind( null, null, testTasksParam ).should.throw( '`task` must be an object' );
        } );
    } );

    xit( 'loads the specified file', function () {
        var pdeps = { 'abs-path': _.noop };
        var loadSubfile = getLoad( pdeps );
        loadSubfile( { absolutePath: 'abs-path' }, {} )
    } );
} );
