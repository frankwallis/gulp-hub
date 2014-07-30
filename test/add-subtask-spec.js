var _       = require( 'lodash' );
var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' );
var tutil   = require( './test-util' );

var HAPPY_PROXY_DEPS = {
    path:         { dirname:        _.noop },
    './hub-util': { isValidHubFile: function (){ return true }    }
};

var getAddSubtask = function ( proxyDeps ) {
    return pequire( '../lib/add-subtask', _.assign( {}, HAPPY_PROXY_DEPS, proxyDeps ) );
};

describe.only( 'add-subtask', function () {

    it( 'errors if subfile is not a valid Gulp Hub file', function () {
        var addSubtask = getAddSubtask( {
            './hub-util': { isValidHubFile: function () { return false } }
        } );
        addSubtask.should.throw( '`subfile` must be a valid Gulp Hub file object.' );
    } );

    it( 'errors if the task registry is not a plain object', function () {
        var addSubtask = getAddSubtask();
        tutil.getTypeExamples( _.isPlainObject ).forEach( function ( type ) {
            addSubtask.bind( null, undefined, type )
                .should.throw('`tasks` must be a plain object.');
        } );
    } );

    it( 'errors if name is not a string', function () {
        var addSubtask = getAddSubtask();
        tutil.getTypeExamples( _.isString ).forEach( function ( type ) {
            addSubtask.bind( null, undefined, {}, type )
                .should.throw('`name` must be a string.');
        } );
    } );

    it( 'errors if param1 is not an array or function', function () {
        var addSubtask = getAddSubtask();
        tutil.getTypeExamples( function ( el ) {
            return _.isArray( el ) || _.isFunction( el )
        } ).forEach( function ( type ) {
            addSubtask.bind( null, undefined, {}, 'string', type )
                .should.throw('`param1` must be an array or function.');
        } );
    } );

    it( 'errors if param2 is not a or function or undefined', function () {
        var addSubtask = getAddSubtask();
        tutil.getTypeExamples( function ( el ) {
            return _.isFunction( el ) || _.isUndefined( el )
        } ).forEach( function ( type ) {
            addSubtask.bind( null, undefined, {}, 'string', [], type )
                .should.throw('`param2` must be a function or undefined.');
        } );
    } );
} );
