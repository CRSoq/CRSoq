module.exports = function (io) {
    io.on('connection', function(socket){
        /*socket.on('chat message', function(msg){
         console.log('message: ' + msg);
         });*/
        console.log('hola');
    });
};