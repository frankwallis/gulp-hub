var should  = require('should');
var gulp = require('gulp');

var loadSubfile = require('../lib/load-subfile');

describe( 'load-subfile', function () {

   it( 'loads the registry and uses a different gulp instance', function () {
      gulp.__hubTest = false;
      var pathname = "./fixtures/gulpfile.js";
      var registry = loadSubfile(gulp, require.resolve(pathname));
      Object.keys(registry.tasks()).length.should.be.equal(2);
      gulp.__hubTest.should.be.false; // this is set by the gulpfile
   });

});
