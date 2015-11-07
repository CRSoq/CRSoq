'use strict';

crsApp.factory('LoginService', function ($http, $q) {
    return{
        logIn: function(data){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.post('/login', data)
                .success(function(response){
                    defered.resolve(response);
                })
                .error(function(error){
                    defered.reject(error);
                });
            return promise;
        }
        //,
        //logOut: function(){
        //deberia destruir el token en la bd?
        // }
    }
});