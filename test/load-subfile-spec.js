var should  = require('should');
var gulp = require('gulp');

var loadSubfile = require('../lib/load-subfile');

describe( 'load-subfile', function () {

   it( 'loads the gulpfile and returns the gulp instance', function () {
      gulp.__hubTest = false;
      var pathname = "./fixtures/gulpfile.js";
      var gulpInst = loadSubfile(require.resolve(pathname));
      gulpInst.should.equal(gulp);
      gulpInst.__hubTest.should.be.true; // this is set by the gulpfile
   });

});
