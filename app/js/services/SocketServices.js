'use strict';

crsApp.factory('SocketServices', function ($rootScope, SERVER_IP, SERVER_PORT) {
    var socket = null;
    return {
        on: function (eventName, callback) {
            if(socket!=null){
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            }
        },
        emit: function (eventName, data) {
            if(socket!=null) {
                socket.emit(eventName, data);
            }
        },
        connect: function () {
            socket = io.connect('http://'+SERVER_IP+':'+SERVER_PORT);
            return socket;
        },
        getSocket: function () {
            return socket;
        }
    };
});