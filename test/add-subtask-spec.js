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
        tutil.getTypeExamples( 'PlainObject' ).forEach( function ( type ) {
            addSubtask.bind( null, undefined, type ).should.throw('`tasks` must be a plain object.');
        } );
        addSubtask.bind( null, { uniqueName: null }, {}, 'string' ).should.not.throw();
    } );

    it( 'errors if name is not a string', function () {
        var addSubtask = getAddSubtask();
        tutil.getTypeExamples( 'String' ).forEach( function ( type ) {
            addSubtask.bind( null, undefined, {}, type ).should.throw('`name` must be a string.');
        } );
        addSubtask.bind( null, { uniqueName: null }, {}, 'string' ).should.not.throw();
    } );

    it( 'errors if param 1 is not an array or a function' );

    it( 'errors if param 2 is not a function or undefined' );
} );
