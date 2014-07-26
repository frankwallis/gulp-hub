require( 'should' );
var sinon = require( 'sinon' );
var proxyquire = require( 'proxyquire' );

describe( 'gulp-hub', function () {

    before( function () {
        this.getTestModule = function () {
            return proxyquire( '../lib/index', {} );
        };
    } );

    beforeEach( function () {
        this.testModule = this.getTestModule();
    } );

    it( 'is a function', function () {
        this.testModule.should.be.an.instanceOf( Function );
    } );

    it( 'takes one argument: A glob or an array of globs' );

    it( 'loads all specified gulpfiles' );

    it( 'creates a gulp task tree' );
} );
