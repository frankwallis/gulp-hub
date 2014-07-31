var _       = require( 'lodash' );
var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' ).noCallThru();

var HAPPY_PROXY_DEPS = {
    gulp: { task: _.noop },
    'run-sequence': _.noop
};

var getAddTask = function ( proxyDeps ) {
    return pequire( '../lib/add-task', _.assign( {}, HAPPY_PROXY_DEPS, proxyDeps ) );
};

describe( 'add-task', function () {

    it( 'adds each tasks\'s subtasks and their parameters to gulp', function () {
        var taskSpy = sinon.spy();
        var addTask = getAddTask( { gulp: { task: taskSpy } } );
        addTask( {
            name: 'task-name',
            subtasks: [
                { name: 'sub-task-name', param1: 'param1', param2: 'param2' }
            ]
        } );
        taskSpy.calledTwice.should.be.true;
        taskSpy.calledWith( 'sub-task-name', 'param1', 'param2' ).should.be.true;
        taskSpy.calledWith( 'task-name' ).should.be.true;
    } );

    it( 'creates a master task to run all subtasks in sequence' );

} );
