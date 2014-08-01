var _       = require( 'lodash' );
var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' );
var tutil   = require( './lib/test-util' );

var MODULE_PATH = '../lib/get-subfiles';

describe( 'get-subfiles', function () {

    it( 'requires an array of file paths', function () {
        var getSubfiles = require( MODULE_PATH );
        tutil.getTypeExamples( _.isArray ).forEach( function ( testValue ) {
            getSubfiles.bind( null, testValue )
                .should.throw( 'An array of file paths is required.' );
        } );

        // Assert we don't get an error for valid values
        getSubfiles.bind( null, [] ).should.not.throw();
    } );

    it( 'returns an empty array if supplied no file paths', function () {
        var getSubfiles = require( MODULE_PATH );
        getSubfiles( [] ).should.be.instanceof( Array ).and.have.lengthOf( 0 );
    } );

    it( 'adds an absolutePath, relativePath, and uniqueName property to each supplied file path', function () {
        var resolveSpy = sinon.spy( function ( filepath ) { return filepath + '-abs' } );
        var getSubfiles = pequire( MODULE_PATH, { path: { resolve: resolveSpy } } );

        var subfiles = getSubfiles( [ 'file-path' ] );
        subfiles.should.be.instanceof( Array ).and.have.lengthOf( 1 );
        subfiles[ 0 ].should.eql( {
            relativePath:   'file-path',
            absolutePath:   'file-path-abs',
            uniqueName:     'file-path'
        } );
        resolveSpy.calledOnce.should.be.true;
        resolveSpy.calledWith( 'file-path' ).should.be.true;

        resolveSpy.reset();

        var subfilesMulti = getSubfiles( [ 'file-path-a', 'file-path-b' ] );
        subfilesMulti.should.be.instanceof( Array ).and.have.lengthOf( 2 );
        subfilesMulti.should.eql( [
            {
                relativePath:   'file-path-a',
                absolutePath:   'file-path-a-abs',
                uniqueName:     'file-path-a'
            }, {
                relativePath:   'file-path-b',
                absolutePath:   'file-path-b-abs',
                uniqueName:     'file-path-b'
            }
        ] );
        resolveSpy.calledTwice.should.be.true;
        resolveSpy.calledWith( 'file-path-a' ).should.be.true;
        resolveSpy.calledWith( 'file-path-b' ).should.be.true;

    } );
} );
