var _ = require('lodash');
var gulp = require('gulp');
var should  = require( 'should' );

var HubRegistry = require('../lib/hub-registry');

describe( 'hub-registry', function () {

    it('defers creation of tasks until flushed', function () {
		var hub = new HubRegistry();
		gulp.registry()._tasks = {};
		gulp.registry(hub);

		hub.setCurrentSubfile('a');
		gulp.task('task1', function() {});
		hub._tasks.should.eql({});

		hub.resetCurrentSubfile();
		hub._tasks.should.eql({});
		
		hub.flushPendingTasks();		
		hub._tasks.should.have.property('task1');
    });

    it('creates subtasks with name <filepath>-<taskname>', function () {
		var hub = new HubRegistry();
		gulp.registry()._tasks = {};
		gulp.registry(hub);

		hub.setCurrentSubfile('a');
		gulp.task('task1', function() {});
		hub.resetCurrentSubfile();		
		hub.flushPendingTasks();

		hub._tasks.should.have.property('a-task1');
    });

    it('returns a copy of its task map', function () {
		var hub = new HubRegistry();
		gulp.registry()._tasks = {};
		gulp.registry(hub);

		hub.setCurrentSubfile('a');
		gulp.task('task1', function () {});
		hub.resetCurrentSubfile();		
		hub.flushPendingTasks();

		var tasks = hub.tasks();
		tasks.should.have.property('task1', hub._tasks['task1']);
		tasks.should.have.property('a-task1', hub._tasks['a-task1']);
    });

    it('returns an instance of HubRegistry', function () {
		var hub = HubRegistry();
		hub.should.be.an.instanceOf(HubRegistry);
    });

});
