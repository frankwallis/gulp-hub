var path = require('path');
var should  = require( 'should' );

var resolveGlob = require('../lib/resolve-glob');

describe( 'resolve-glob', function () {

    it( 'accepts string parameter', function () {
        var pattern = path.join(__dirname, 'fixtures/gulpfile.js');
        var filelist = resolveGlob(pattern, '/');
        filelist.should.eql([pattern]);
    });

    it( 'accepts array parameter', function () {
        var pattern = [ path.join(__dirname, 'fixtures/dir1/gulpfile1.js'),
                        path.join(__dirname, 'fixtures/dir2/gulpfile2.js') ]

        var filelist = resolveGlob(pattern, '/');
        filelist.should.eql(pattern)
    });

    it( 'rejects other parameters', function () {
        var INVALID_VALUES = [ '', 0, 1, true, false, [], {}, { a: 'foo' }, null, undefined ];

        // Assert we get an error for invalid values
        INVALID_VALUES.forEach( function (testValue) {
            resolveGlob.bind( null, testValue ).should.throw(
                'A glob pattern or an array of glob patterns is required.'
            );
        });

        // Assert we don't get an error for a valid glob (non-empty string)
        resolveGlob.bind( null, 'ok' ).should.not.throw();
    });

    it( 'uses rootDir parameter to determine base path of search', function () {
        var rootDir = path.join(__dirname, "fixtures")
        var filelist = resolveGlob('gulpfile*.js', rootDir);
        filelist.should.eql([path.join(__dirname, "fixtures", "gulpfile.js")])

        rootDir = path.join(__dirname, "fixtures", "dir1")
        filelist = resolveGlob('gulpfile*.js', rootDir);
        filelist.should.eql([ path.join(__dirname, "fixtures", "dir1", "gulpfile1.js") ])
    });

    it( 'defaults rootDir to current working directory', function () {
        var relpath = path.relative(process.cwd(), path.join(__dirname, "fixtures"));
        var filelist = resolveGlob(path.join(relpath, "gulpfile*.js"));
        filelist.should.eql([path.join(__dirname, "fixtures", "gulpfile.js")])
    });

});
