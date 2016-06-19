$(document).ready(function() {
    var socket = io.connect(); //this object will automatically attempt to connect to server 
    var input = $('input');
    var messages = $('#messages');
    var updateSpace = $("#updater");

    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
    };
    
    var addUpdate = function(update, user){
        updateSpace.text(user+' '+update);
    };

    input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            var update = "is typing";
            socket.emit("updating", update);
        }
        else{
            var message = input.val();
            addMessage(message);
            socket.emit('message', message);
            input.val('');
        }
    });
    input.on("keyup", function(event){
        if(event.keyCode != 13){
            socket.emit("doneUpdating");
        }
    });
    
    socket.on('message', addMessage); //for when someone else broadcasts a message
    socket.on("updating", addUpdate); //for when someone else broadcasts an update
    socket.on("doneUpdating", addUpdate);
});