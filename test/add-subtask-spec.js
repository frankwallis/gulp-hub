var _       = require( 'lodash' );
var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' );

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

    it( 'ensures the task registry is an array' );

    it( 'ensures name is a string' );

    it( 'ensures param 1 is an array or a function' );

    it( 'ensures param 2 is a function or undefined' );
} );
