import Server from 'socket.io';
import { server } from '../../server';
import { Message } from '../models';

const io = new Server(server);

// usernames which are currently connected to the chat
var usernames = {};

function check_key(v)
{
    var val = '';

    for(var key in usernames)
    {
        if(usernames[key] == v)
            val = key;
    }
    return val;
}

io.sockets.on('connection', function (socket) {

    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data) {
        // we tell the client to execute 'updatechat' with 2 parameters
        io.sockets.emit('updatechat', socket.username, data);
    });

    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function(username){
        // we store the username in the socket session for this client
        socket.username = username;
        // add the client's username to the global list
        usernames[username] = socket.id;
        // echo to client they've connected
        socket.emit('updatechat', 'SERVER', 'you have connected');
        // echo to client their username
        socket.emit('store_username', username);
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected: ' + socket.id);
        // update the list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function(){
        // remove the username from global usernames list
        delete usernames[socket.username];
        // update list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
        // echo globally that this client has left
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    });

    // when the user sends a private msg to a user id, first find the username
    socket.on('check_user', function(asker, id){
        //console.log("SEE: "+asker); console.log(id);
        io.sockets.socket(usernames[asker]).emit('msg_user_found', check_key(id));
    });

    // when the user sends a private message to a user.. perform this
    socket.on('msg_user', async function(to, from, msg) {
        //console.log("From user: "+username);
        //console.log("To user: "+usr);
        //console.log(usernames);
        io.sockets.socket(usernames[usr]).emit('msg_user_handle', from, msg);

        const message = new Message({
            from: from,
            to: to,
            message: msg
        });
        await message.save();
    });

});
