'use strict';

crsApp.factory('SocketServices', function ($rootScope) {
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
            socket = io.connect();
            return socket;
        },
        getSocket: function () {
            return socket;
        }
    };
});