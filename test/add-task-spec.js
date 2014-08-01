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

    it( 'creates a master task to run all subtasks in sequence', function () {
        var runSeqSpy = sinon.spy();
        var taskSpy = sinon.spy( function ( name, callback ) {
            callback();
        } );

        var addTask = getAddTask( {
            gulp: {
                task: taskSpy
            },
            'run-sequence': runSeqSpy
        } );

        addTask( {
            name: 'task-name',
            subtasks: [
                {
                    name: 'subfile-unique-name-1-task-name',
                    param1: _.noop
                },
                {
                    name: 'subfile-unique-name-2-task-name',
                    param1: _.noop
                }
            ] }
        );

        taskSpy.calledThrice.should.be.true;
        taskSpy.calledWith( 'task-name' ).should.be.true;
        taskSpy.calledWith( 'subfile-unique-name-1-task-name' ).should.be.true;
        taskSpy.calledWith( 'subfile-unique-name-2-task-name' ).should.be.true;

        runSeqSpy.calledOnce.should.be.true;
        runSeqSpy.calledWith(
            'subfile-unique-name-1-task-name',
            'subfile-unique-name-2-task-name'
        ).should.be.true;
    } );

} );
