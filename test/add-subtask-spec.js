var _       = require( 'lodash' );
var should  = require( 'should' );
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' );
var tutil   = require( './lib/test-util' );

var HAPPY_PROXY_DEPS = {
    path:         { dirname:        _.noop },
    './hub-util': { isValidHubFile: function (){ return true } }
};

var getAddSubtask = function ( proxyDeps ) {
    return pequire( '../lib/add-subtask', _.assign( {}, HAPPY_PROXY_DEPS, proxyDeps ) );
};

describe( 'add-subtask', function () {

    it( 'errors if subfile is not a valid Gulp Hub file', function () {
        var addSubtask = getAddSubtask( {
            './hub-util': { isValidHubFile: function () { return false } }
        } );
        addSubtask.should.throw( '`subfile` must be a valid Gulp Hub file object.' );
    } );

    it( 'errors if the task registry is not a plain object', function () {
        var addSubtask = getAddSubtask();
        tutil.getTypeExamples( _.isPlainObject ).forEach( function ( type ) {
            addSubtask.bind( null, undefined, type )
                .should.throw('`tasks` must be a plain object.');
        } );
    } );

    it( 'errors if name is not a string', function () {
        var addSubtask = getAddSubtask();
        tutil.getTypeExamples( _.isString ).forEach( function ( type ) {
            addSubtask.bind( null, undefined, {}, type )
                .should.throw('`name` must be a string.');
        } );
    } );

    it( 'errors if param1 is not an array or function', function () {
        var addSubtask = getAddSubtask();
        var excludeFunc = function ( el ) {
            return _.isArray( el ) || _.isFunction( el );
        };
        tutil.getTypeExamples( excludeFunc ).forEach( function ( type ) {
            addSubtask.bind( null, undefined, {}, 'string', type )
                .should.throw('`param1` must be an array or function.');
        } );
    } );

    it( 'errors if param2 is not a or function or undefined', function () {
        var addSubtask = getAddSubtask();
        var excludeFunc = function ( el ) {
            return _.isFunction( el ) || _.isUndefined( el );
        };
        tutil.getTypeExamples( excludeFunc ).forEach( function ( type ) {
            addSubtask.bind( null, undefined, {}, 'string', [], type )
                .should.throw('`param2` must be a function or undefined.');
        } );
    } );

    it( 'registers a master task with `name` if it doesn\'t already exist', function () {
        var testTasks = {};
        var addSubtask = getAddSubtask();
        addSubtask( { uniqueName: 'unique-name' }, testTasks, 'task-name', [] );

        var taskObj = testTasks[ 'task-name' ];
        _.isPlainObject( taskObj ).should.be.true;
        taskObj.name = 'task-name';
        _.isArray( taskObj.subtasks ).should.be.true;
    } );

    it( 'skips task registry record initialization if `name` already exists', function () {
        var TASK_NAME = 'task-name';
        var testTasks = {};
        testTasks[ TASK_NAME ] = {
            name: TASK_NAME,
            subtasks: []
        };
        var addSubtask = getAddSubtask();
        addSubtask( { uniqueName: 'unique-name' }, testTasks, TASK_NAME, [] );

        var taskObj = testTasks[ TASK_NAME ];
        _.isPlainObject( taskObj ).should.be.true;
        taskObj.name = TASK_NAME;
        _.isArray( taskObj.subtasks ).should.be.true;
    } );

    it( 'registers the subfile\'s tasks prefixed with its unique name under the master task name', function () {
        var testTasks = {};
        var addSubtask = getAddSubtask();
        addSubtask( { uniqueName: 'unique-name' }, testTasks, 'task-name', [] );
        testTasks[ 'task-name' ].subtasks[ 0 ].name.should.eql( 'unique-name-task-name' );
    } );

    it( 'prefixes the subfile\'s task dependencies with its unique name', function () {
        var testTasks = {};
        var addSubtask = getAddSubtask();
        addSubtask(
            { uniqueName: 'subfile-unique-name' }, testTasks, 'task-name',
            [ 'task-dep-1', 'task-dep-2' ]
        );
        var subtaskDeps = testTasks[ 'task-name' ].subtasks[ 0 ].param1;
        subtaskDeps[ 0 ].should.eql( 'subfile-unique-name-task-dep-1' );
        subtaskDeps[ 1 ].should.eql( 'subfile-unique-name-task-dep-2' );
    } );

    it( 'wraps the subtask\'s callbacks in a function that corrects the working directory', function () {
        var testTasks = {};
        var callbackSpy = sinon.spy();
        var dirnameSpy = sinon.spy( function () { return '.' } );

        var addSubtask = getAddSubtask( { path: { dirname: dirnameSpy } } );
        addSubtask(
            { uniqueName: 'subfile-unique-name', absolutePath: '.' },
            testTasks, 'task-name', callbackSpy
        );
        testTasks[ 'task-name' ].subtasks[ 0 ].param1();

        dirnameSpy.calledOnce.should.be.true;
        dirnameSpy.calledWith( '.' ).should.be.true;
        callbackSpy.calledOnce.should.be.true;

        dirnameSpy.reset();
        callbackSpy.reset();

        addSubtask(
            { uniqueName: 'subfile-unique-name-2', absolutePath: '.' },
            testTasks, 'task-name-2', [], callbackSpy
        );
        testTasks[ 'task-name-2' ].subtasks[ 0 ].param2();

        dirnameSpy.calledOnce.should.be.true;
        dirnameSpy.calledWith( '.' ).should.be.true;
        callbackSpy.calledOnce.should.be.true;
    } );
} );
