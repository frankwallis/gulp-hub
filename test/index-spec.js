require( 'should' );
var sinon = require( 'sinon' );
var proxyquire = require( 'proxyquire' );

var hub = require( '../lib/index' );

describe( 'Gulp Hub', function ( ) {

	before( function ( ) {
		this.getTestModule = function ( ) {
			return proxyquire( '../lib/index', {} );
		};
	} );

	beforeEach( function ( ) {
		this.testModule = this.getTestModule();
	} );

	it( 'is a function', function ( ) {
		this.testModule.should.be.an.instanceOf( Function );
	} );

	it( 'takes one argument; a glob or an array of globs' );

	it( 'will load all the gulp files' );

	it( 'will create a gulp task tree' );
} );