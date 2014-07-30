var _       = require( 'lodash' );
var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' );

var HAPPY_PROXY_DEPS = {
    './hub-util': {
        isValidHubFile: function (){ return true }
    },
    './add-subtask': _.noop
};

var getLoad = function ( proxyDeps ) {
    return pequire( '../lib/load-subfile', _.assign( {}, HAPPY_PROXY_DEPS, proxyDeps ) );
};

describe.only( 'load-subfile', function () {

    it( 'errors if subfile is not a valid Gulp Hub file', function () {
        var loadSubfile = getLoad( {
            './hub-util': {
                isValidHubFile: function (){ return false }
            }
        } );
        loadSubfile.should.throw( '`subfile` must be a valid Gulp Hub file object.' );
    } );

} );
