/******************************************************************
 * @author: <denishorobtsov@gmail.com>                            *
 ******************************************************************/
window.onload = function()
{
    /** List of tasks */
    var taskList = new TaskList();

    /** tasks' id's */
    var taskIds        = 0,
        taskInputFiled = $( "input[name=task]" );
    /**************************************************************
     *                   User input handler                       *
     **************************************************************/

    $( ".input" ).keypress( function( e ) {
        if ( e.keyCode === 13 )
        {
            $( "#submit" ).click();
            e.preventDefault();
        }
    });

    $( "#submit" ).click( function() {
        var task = taskInputFiled.val();
        if ( task.length !== 0 )
        {
            appendTask( task );
        }

        /** Clear previous task name */
        taskInputFiled.val( '' );
    });

    /**
     * Append task to the task list
     *
     * @param taskText
     */
    var appendTask = function( taskText )
    {
        if ( taskList.appendTask( taskText ) )
        {
            /** determine the block to append child elements */
            var unresolved = $( ".unresolvedTasks" );

            /** task wrapper */
            var taskWrapper = createContainer();

            /** task element */
            var task = createTaskTicket( taskText );

            $( taskWrapper ).append( task );
            unresolved.append( taskWrapper );

            var cross = createCompleteAction(),
                  del = createDeleteAction( taskWrapper );

            $( taskWrapper ).append( cross );
            $( taskWrapper ).append(  del  );

            $( cross ).bind( "click", function() {
                resolveTask( taskWrapper );
            });
        }
        else
        {
            alert( "Task is already in your task list." );
        }
    };

    /**
     * Resolve task
     *
     * @param taskContainer
     */
    var resolveTask = function( taskContainer )
    {
        var task = $( taskContainer).find( ".unresolved" );
        $( task ).addClass( "cross-task" );

        /** get the reference to complete button */
        var complete = $( taskContainer ).find( ".cross-action" );

        /** retrieve the name of the task from wrapper */
        var taskName = $( "div.cross-task" ).text();

        /** check whether the task is not completed */
        if ( !taskList.getTaskStatus( taskName) )
        {
            taskList.setTaskStatus( taskName, 1 );
            $( ".resolvedTasks"   ).append( taskContainer );
            $( ".unresolvedTasks" ).remove( taskContainer );

            /** change status to completed
             * and prevent button click */
            complete.text( "completed" );
            complete.addClass( "disable-click" );
        }
    };

    /**
     * Create task block
     *
     * @param taskTitle
     * @returns {Element}
     */
    var createTaskTicket = function( taskTitle )
    {
        var task       = document.createElement( "div" );
        task.id        = taskIds++;
        task.innerHTML = taskTitle;

        $( task ).addClass( "unresolved" );

        return task;
    };

    /**
     * Create 'complete' action for the task
     *
     * @returns {Element}
     */
    var createCompleteAction = function()
    {
        var cross       = document.createElement( "span" );
        cross.innerHTML = "complete";
        /** add line-through style */
        $( cross ).addClass( "cross-action" );

        return cross;
    };

    /**
     * Create 'delete' action for the task
     *
     * @param taskContainer
     * @returns {Element}
     */
    var createDeleteAction = function( taskContainer )
    {
        var del       = document.createElement( "span" );
        del.innerHTML = "delete";

        $( del ).addClass( "delete-action" );

        $( del ).bind( "click", function() {
            /** fetch task name from the task wrapper */
            var taskName = $( "div.unresolved" ).text();

            taskList.removeTask( taskName );

            $( taskContainer ).remove();
        });

        return del;
    };

    /**
     * Create task container
     *
     * @returns {Element}
     */
    var createContainer = function()
    {
        var container = document.createElement( "div" );

        $( container ).addClass( "taskBlock" );

        return container;
    };

    /**************************************************************
     *                   Task list presenter                      *
     **************************************************************/

    /**
     * Task presenter
     *
     * @param taskTitle
     * @constructor
     */
    function Task( taskTitle )
    {
        this._taskName  = taskTitle;
        this._completed = 0;
    }

    /**
     * Task list presenter
     *
     * @constructor
     */
    function TaskList()
    {
        this._tasks = [];
    }

    /**
     * Append task to the task list
     *
     * @param task
     */
    TaskList.prototype.appendTask = function( task )
    {
        var tasks = this._tasks;

        /** if task list is empty */
        if ( !tasks.length )
        {
            var t = new Task( task );
            tasks.push( t );
            return true;
        }

        var inArray = false;
        tasks.forEach( function( t ) {
            if ( t._taskName === task )
            {
                inArray = true;
            }
        });

        /** check if task not in task list */
        if ( !inArray )
        {
            var tk = new Task( task );
            tasks.push( tk );

            return true;
        }
        else
        {
            /** task already in list*/
            return false;
        }
    };

    /**
     * Remove task from the task list
     *
     * @param task
     */
    TaskList.prototype.removeTask = function( task )
    {
        var tasks = this._tasks;

        if ( !tasks.length )
        {
            /** there are no elements to delete */
            return;
        }

        tasks.forEach( function( t, i ) {
            if ( t._taskName === task )
            {
                tasks.splice( i, 1 );
            }
        });
    };

    /**
     * Set task status
     *
     * @param task
     * @param status
     */
    TaskList.prototype.setTaskStatus = function( task, status )
    {
        var tasks = this._tasks;

        tasks.forEach( function( t ) {
            if ( t._taskName === task )
            {
                t._completed = status;
                return;
            }
        });
    };

    /**
     * Get task status
     *
     * @param task
     */
    TaskList.prototype.getTaskStatus = function( task )
    {
        var tasks  = this._tasks,
            status = 0;

        tasks.forEach( function( t ) {
            if ( t._taskName === task )
            {
                status = t._completed;
            }
        });

        return status;
    };
};
