var _       = require('lodash');
var should  = require('should');
var HubRegistry = require('../lib/');
var DefaultRegistry = require('undertaker-registry');

// end to end tests
describe('Examples', function () {

   beforeEach(function () {
      var gulp = require('gulp');
      var registry = new DefaultRegistry();
      gulp.registry(registry);
      registry._tasks = {};
   });

   beforeEach(function () {
      var filelist = [
         '../examples/gulpfile.js',
         '../examples/project1/gulpfile.js',
         '../examples/project1/project1A/gulpfile.js',
         '../examples/project1/project1B/gulpfile.js',
         '../examples/project2/gulpfile.js'
      ];

      _.each(filelist, function(moduleName) {
         var name = require.resolve(moduleName);
         delete require.cache[name];
      });
   });

   it('handles no files', function () {
      var hub = new HubRegistry('test-pattern');
      _.keys(hub.tasks()).length.should.be.equal(0);
   });

   it('resolves array pattern', function () {
      var hub = new HubRegistry([
         '../examples/project1/proj*A/gulpfile.js',
         '../examples/project1/proj*B/gulpfile.js'
      ]);
      hub.init(require('gulp'));
      _.keys(hub.tasks()).length.should.be.equal(6);
   });

   it('handles recursive calls', function () {
      var hub = new HubRegistry('../examples/project1/gulpfile.js');
      hub.init(require('gulp'));
      _.keys(hub.tasks()).length.should.be.equal(7);
      _.keys(hub.tasks()).should.containEql('project1ATask');
      _.keys(hub.tasks()).should.containEql('project1BTask');
   });

   it('returns a copy of its task map', function () {
      var hub = new HubRegistry(['../examples/gulpfile.js']);
      hub.init(require('gulp'));
      _.keys(hub.tasks()).length.should.be.equal(8);
      _.keys(hub.tasks()).should.containEql('project1ATask');
      _.keys(hub.tasks()).should.containEql('project1BTask');
   });

   it('transfers tasks from existing subfile', function () {
      var gulp = require('gulp');
      gulp.task('mytesttask', function() {});
      var hub = new HubRegistry(['../examples/gulpfile.js']);
      hub.init(gulp);
      _.keys(hub.tasks()).should.not.containEql('mytesttask');
      gulp.registry(hub);
      _.keys(hub.tasks()).should.containEql('mytesttask');
   });

   it('leaves gulp unaffected', function () {
      var gulp = require('gulp');
      gulp.task('mytesttaska', function() {});
      gulp.task('mytesttask2', function() {});
      var hub = new HubRegistry(['../examples/project1/gulpfile.js']);
      hub.init(gulp);
      _.keys(gulp.registry().tasks()).length.should.be.equal(2);
      _.keys(gulp.registry().tasks()).should.containEql('mytesttaska');
      _.keys(gulp.registry().tasks()).should.containEql('mytesttask2');
   });

});
