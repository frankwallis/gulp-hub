var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' );

describe( 'resolve-glob', function () {

    it( 'resolves glob pattern to a list of files', function () {
        var pdeps = { glob: { sync: sinon.spy() } };
        var resolveGlob = pequire( '../lib/resolve-glob', pdeps );

        var spy = pdeps.glob.sync;
        var globOpts = { 'nosort': true, 'cwd': undefined };

        resolveGlob( 'single-glob-pattern' );
        spy.calledOnce.should.be.true;
        spy.calledWith( 'single-glob-pattern', globOpts ).should.be.true;

        spy.reset();

        resolveGlob( [ 'array-with-one-element' ] );
        spy.calledOnce.should.be.true;
        spy.calledWith( 'array-with-one-element', globOpts ).should.be.true;

        spy.reset();

        globOpts = { 'nosort': true, 'cwd': 'somedir' };
        resolveGlob( [ 'array', 'with', 'more', 'than', 'one', 'element' ], 'somedir' );
        spy.calledOnce.should.be.true;
        spy.calledWith( '{array,with,more,than,one,element}', globOpts ).should.be.true;
    } );
} );
