/*
Daniel Cobb
Project 4: To Do List App
4/27/16
*/
$(document).ready(function(){
// ---------- Deletes Item From Storage ---------- //
    var deleteListen = function(index){
        // Get localStorage item and parse it into json
        var tasksL=JSON.parse(localStorage.getItem('tasks'));
        // Remove 1 entry starting from the index location
        tasksL.splice(index, 1);
        // Turn json item back into a string to store into localStorage
        var data = JSON.stringify(tasksL);
        // Reset localStorage
        localStorage.setItem('tasks',data);
        // Remove and animate task
        $('.deleteItem').toggle( "puff", function(){loadTasks();});
    };
// ---------- Loads Saved Tasks ---------- //
    var loadTasks = function(){
        // Clears <ul> html to prevent double <li> items
        $('#task-list, #completed-task').html(' ');
        // Turn off the .delete listener, avoid a glitch where listener was not updating after loading new items
        $('.delete').off();
        // If there is no localStorage console.log that there is none
        if (localStorage.getItem("tasks") === null) {
            console.log('Local Storage item does not exist.');
        }
        // If localStorage exists than display tasks
        else{
            // Parse localStorage into json
            var tasksL=JSON.parse(localStorage.getItem('tasks'));
            // Loop through json and create tasks
            for(i = 0; i<tasksL.length; i++){
                var title = tasksL[i].title;
                var date = tasksL[i].date;
                var desc = tasksL[i].desc;
                var status = tasksL[i].complete;
                var listItem = '<li class="list-box" data-index="'+i+'"><span class="delete">x</span>';
                var listTitle = '<span class="task-title">'+title+'<br><label for="check">Complete</label><input type="checkbox" value="" id="check" name="check"/></span>';
                var listDate = '<span class="task-date">Due On: '+date+'</span>';
                var listDesc ='<span class="task-desc">'+desc+'</span>';
                var endList = '<span class="edit">Edit</span></li>';
                // status of false means the item is not complete, decided where to place list item
                if(status === 'false'){
                    $('#task-list').prepend(listItem+listTitle+listDate+listDesc+endList);
                }
                // if item is complete place in completed div and check the checkbox
                else{
                    $('#completed-task').prepend(listItem+listTitle+listDate+listDesc+endList);
                    $('#completed-task #check').prop('checked', true);
                }
            }
            // ---------- Reset Listeners and Change with Checkbox ---------- //
            $('.delete').button().on('click', function(){
                // Get html attribute data-index and set it to index
                var index = $(this).parent('li').attr('data-index');
                // add deleteItem class
                $(this).parent('li').addClass('deleteItem');
                // send index to localStorage delete key
                localStorage.setItem('delete',index);
                // open delete modal
                $('#delete-todo').dialog('open');
            });
            $('.edit').button().on('click', function(){
                // Get html attribute data-index and set it to index
                var index = $(this).parent('li').attr('data-index');
                // set edit key
                localStorage.setItem('edit',index);
                // open edit modal
                $('#edit-todo').dialog('open');
            });
        }
        // ----------- Change with Checkbox ---------- //
            $('li #check').on('change', function(){
                // parse tasks key into json
                var tasksL=JSON.parse(localStorage.getItem('tasks'));
                // set the id from html attribute data-index
                var id = $(this).closest('li').attr('data-index');
                // if the box is checked set to true
                if($(this).is(':checked')){
                    var statusUpdate = 'true';
                }
                // if not checked set to false
                else{
                    var statusUpdate = 'false';
                }
                //update the json
                tasksL[id].complete = statusUpdate;
                // turn json back to string
                var data = JSON.stringify(tasksL);
                // send to localStorage
                localStorage.setItem('tasks',data);
                //reload the #container
                $('#container').load(loadTasks());
            });
    };// End of loadTasks

    // ---------- Load Tasks on document load --------- //
    $(document).on('load', loadTasks());
    // ---------- Stores Tasks in localStorage ---------- //
    var storeTask = function(title, date, desc, status){
        // if no local storage tasksL is empty array
        if (localStorage.getItem("tasks") === null) {
            var tasksL=[];
            // send data to tasksL
            tasksL.push({'title':title, 'date':date, 'desc': desc, 'complete':status});
            // turn data into string
            var data = JSON.stringify(tasksL);
            // store into localStorage
            localStorage.setItem('tasks',data);
        }
        // if localStorage does exist
        else{
            // parse into json
            var tasksL=JSON.parse(localStorage.getItem('tasks'));
            // send new task to json
            tasksL.push({'title':title, 'date':date, 'desc': desc, 'complete':status});
            // turn to string
            var data = JSON.stringify(tasksL);
            //store
            localStorage.setItem('tasks',data);
        }// reload container
        $('#container').load(loadTasks());
    };
    // ---------- Add New Task ---------- //
    $('.add-new button').button({
        icons:{primary:'ui-icon-plusthick'}
    });
    $('.add-new').find('button').on('click', function(){
        $('#new-todo').dialog('open');
    });
    $('#new-todo').dialog({
        width: '50%',
        height:400,
        modal:true,
        autoOpen: false,
        close: function(){$('#new-todo input').val(' ');},
        buttons:{
            'Add Task':function(){
                // get values and send to storeTask
                var title = $('#new-title').val();
                var date = $('#new-date').val();
                var desc = $('#new-desc').val();
                var status = 'false';
                $(this).dialog('close');
                storeTask(title, date, desc, status);
            }
        }
    });
    // ---------- Set Datepicker ---------- //
    $('#new-date').datepicker({minDate:0});
    // ---------- Connect New and Complete tasks for drag drop --------- //
    $('.sortable, #completed-task').sortable({
        connectWith:'.connected-task'
    });
    // ---------- Delete Task ---------- //
    $('.delete').button().on('click', function(){
        // set index
        var index = $(this).parent('li').attr('data-index');
        // add deleteItem class
        $(this).parent('li').addClass('deleteItem');
        // set delete key/value
        localStorage.setItem('delete',index);
        //open modal
        $('#delete-todo').dialog('open');
    });
    $('#delete-todo').dialog({
        width: '50%',
        height:400,
        modal:true,
        autoOpen: false,
        close: function(){$(this).dialog('close');},
        buttons:{
            // confirm delete: get delete key and send value to deleteListen
            'Confirm':function(){var index = localStorage.getItem('delete');$(this).dialog('close');deleteListen(index);},
            'Cancel':function(){$(this).dialog('close');}
        }
    });
    // ---------- Edit Task ---------- //
    $('.edit').button().on('click', function(){
        // get index
        var index = $(this).parent('li').attr('data-index');
        // set edit key value
        localStorage.setItem('edit',index);
        // open modal
        $('#edit-todo').dialog('open');
    });
    $('#edit-todo').dialog({
        width: '50%',
        height:400,
        modal:true,
        autoOpen: false,
        open:function(event, ui){
            // get index, parse localStorage data, get values based on index and set input values in modal to localStorage values
            var index = localStorage.getItem('edit');
            var tasksL=JSON.parse(localStorage.getItem('tasks'));
            var obj = tasksL[index];
            var title = obj.title;
            var date = obj.date;
            var desc = obj.desc;
            $('#edit-title').val(title);
            $('#edit-date').val(date);
            $('#edit-desc').val(desc);
        },
        close: function(){$(this).dialog('close');},
        buttons:{
            'Update':function(){
                // set vars for new values, change complete status to false, update localStorage and reload container div
                var title = $('#edit-title').val();
                var date = $('#edit-date').val();
                var desc = $('#edit-desc').val();
                var status = 'false';
                var index = localStorage.getItem('edit');
                var tasksL=JSON.parse(localStorage.getItem('tasks'));
                tasksL[index] = ({'title':title, 'date':date, 'desc': desc, 'complete':status});
                var data = JSON.stringify(tasksL);
                localStorage.setItem('tasks',data);
                $(this).dialog('close');
                $('#container').load(loadTasks());
            }
        }
    });
    // ---------- Change Status of Task on Drag Drop ---------- //
        $( ".connected-task" ).on( "sortreceive", function( event, ui) {
            // parse localStorage
            var tasksL=JSON.parse(localStorage.getItem('tasks'));
            // set item to <li> being dropped by using ui.item
            var item = ui.item;
            // get <li> data-index
            var id = $(item).attr('data-index');
            //update status
            if(tasksL[id].complete === 'false'){
                var statusUpdate = 'true';
            }else{
                var statusUpdate = 'false';
            }
            tasksL[id].complete = statusUpdate;
            // turn back into string, store, and reload container div.
            var data = JSON.stringify(tasksL);
            localStorage.setItem('tasks',data);
            $('#container').load(loadTasks());
        });
});
