'use strict';

crsApp.factory('LoginService', function ($http, $q) {
    var postHelper = function(ruta, data){
        var defered = $q.defer();
        var promise = defered.promise;
        $http.post(ruta,data)
        /*
            .success(function (response) {
                defered.resolve(response);
            })
            .error(function (error) {
                defered.reject(error);
            });
        */
            .then(function onSuccess(response){
                defered.resolve(response.data);
            }, function onError(response){
                defered.reject(response.data)
            });
        return promise;
    };
    return{
        logIn: function(data){
            return postHelper('/login',data);
        }
        //,
        //logOut: function(){
        //deberia destruir el token en la bd?
        // }
    }
});