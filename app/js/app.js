'use strict';
var crsApp = angular.module('crsApp', [
    'ui.router',
    'ngAnimate',
    'ngStorage',
    'ngMaterial',
    'md.data.table',
    'toastr',
    'nvd3',
    'ngclipboard',
    'configuration'
]);

crsApp.config(function($stateProvider, $urlRouterProvider, toastrConfig) {

    angular.extend(toastrConfig, {
        allowHtml: true,
        closeButton: true,
        closeHtml: '<button style="color: #3f51b5">&times;</button>',
        extendedTimeOut: 1000,
        iconClasses: {
            error: 'toast-error',
            info: 'toast-info',
            success: 'toast-success',
            warning: 'toast-warning'
        },
        messageClass: 'toast-message',
        onHidden: null,
        onShown: null,
        onTap: null,
        progressBar: true,
        tapToDismiss: true,
        templates: {
            toast: 'directives/toast/toast.html',
            progressbar: 'directives/progressbar/progressbar.html'
        },
        timeOut: 6000,
        titleClass: 'toast-title',
        toastClass: 'toast'
    });
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('crsApp', {
            url: '/',
            views: {
                "content": {
                    templateUrl: 'partials/content/content.html'
                },
                "menu@crsApp": {
                    templateProvider:
                        function ($rootScope, $http, SessionServices) {
                            var user = SessionServices.getSessionData();
                            if(user.tipo == 'profesor'){
                                return $http.get('partials/content/menu/menuProfesor.html')
                                    .then(function (template) {
                                        return  template.data;
                                    });
                            }else if(user.tipo == 'estudiante'){
                                    return $http.get('partials/content/menu/menuEstudiante.html')
                                        .then(function (template) {
                                            return  template.data;
                                        });
                            }else if(user.tipo == 'administrador'){
                                return $http.get('partials/content/menu/menuAdministrador.html')
                                    .then(function (template) {
                                        return  template.data;
                                    });
                            }
                        }

                },
                "main@crsApp": {
                    templateUrl: 'partials/content/main/main.html'
                }
            },
            authenticate:true
        })
        .state('crsApp.login', {
            url: 'login',
            views: {
                "menu@crsApp": {
                    templateUrl: ''
                },
                "main@crsApp": {
                    templateUrl: 'partials/content/login/login.html'
                }
            },
            authenticate:false
        })
        .state('crsApp.adminProfesores', {
            url: 'admin/profesores',
            views: {
                "main@crsApp": {
                    templateUrl: 'partials/content/administracion/adminProfesores.html'
                }
            },
            authenticate: true,
            admin: true
        })
        .state('crsApp.adminAsignaturas', {
            url: 'admin/asignaturas',
            views: {
                "main@crsApp": {
                    templateUrl: 'partials/content/administracion/adminAsignaturas.html'
                }
            },
            authenticate: true,
            admin: true
        })
        .state('crsApp.adminCalendario', {
            url: 'admin/calendario',
            views: {
                "main@crsApp": {
                    templateUrl: 'partials/content/administracion/adminCalendario.html'
                }
            },
            authenticate: true,
            admin: true
        })
	.state('crsApp.adminAlumnos', {
	    url: 'admin/alumno',
            views: {
               "main@crsApp": {
		    templateUrl: 'partials/content/administracion/adminAlumnos.html'
	       }
	    },
	    authenticate: true,
            admin: true
	})
	// agregar configuracion en el menu del profesor
	.state('crsApp.asignatura.configuracion', {
	    url: ': /Configuracion',
	    views: {
	        'main@crsApp': {
		    templateUrl: 'partials/content/asignatura/configuracionAsignatura.html'
	        }
	    },
	    authenticate:true
	})
        .state('crsApp.asignatura', {
            url: ':nombre_asignatura',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/asignatura/informacionGeneral.html'
                }
            },
            authenticate:true
        })
        .state('crsApp.asignatura.biblioteca', {
            url: '/BibliotecaDePreguntas',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/asignatura/bibliotecaDePreguntas.html'
                }
            },
            authenticate:true
        })
        .state('crsApp.asignatura.curso', {
            url: '/:ano/:semestre/:grupo_curso/:id_curso',
            authenticate:true
        })
        .state('crsApp.asignatura.curso.equipos', {
            url: '/equipos',
            views: {
                'main@crsApp': {
                    templateProvider:
                        function ($rootScope, $http) {
                            if($rootScope.user.tipo=='estudiante'){
                                return $http.get('partials/content/asignatura/curso/equipos/equipoEstudiante.html')
                                    .then(function (template) {
                                        return  template.data;
                                    });
                            }else if($rootScope.user.tipo=='profesor'){
                                return $http.get('partials/content/asignatura/curso/equipos/equiposProfesor.html')
                                    .then(function (template) {
                                        return  template.data;
                                    });
                            }
                        }
                }
            },
            authenticate:true
        })
        .state('crsApp.asignatura.curso.clases', {
            url: '/clases',
            views: {
                'main@crsApp': {
                    templateProvider:
                        function ($rootScope, $http) {
                            if($rootScope.user.tipo=='estudiante'){
                                return $http.get('partials/content/asignatura/curso/clases/clasesEstudiante.html')
                                    .then(function (template) {
                                        return  template.data;
                                    });
                            }else if($rootScope.user.tipo=='profesor'){
                                return $http.get('partials/content/asignatura/curso/clases/clasesProfesor.html')
                                    .then(function (template) {
                                        return  template.data;
                                    });
                            }
                        }
                }
            },
            authenticate:true
        })
        .state('crsApp.asignatura.curso.clases.sesion', {
            url: '/:id_clase/sesion',
            views: {
                'main@crsApp': {
                    templateProvider:
                        function ($rootScope, $http) {
                            if($rootScope.user.tipo=='estudiante'){
                                return $http.get('partials/content/asignatura/curso/clases/sesion/pregunta/sesionEstudiante.html')
                                    .then(function (template) {
                                        return  template.data;
                                    });
                            }else if($rootScope.user.tipo=='profesor'){
                                return $http.get('partials/content/asignatura/curso/clases/sesion/sesionProfesor.html')
                                    .then(function (template) {
                                        return  template.data;
                                    });
                            }
                        }
                }
            },
            authenticate:true
        })
        .state('crsApp.asignatura.curso.clases.sesion.pregunta', {
            url: '/:id_pregunta',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/asignatura/curso/clases/sesion/pregunta/preguntaSesionProfesor.html'
                }
            },
            authenticate:true
        })
        .state('crsApp.asignatura.curso.preguntas', {
            url: '/preguntas',
            views: {
                'main@crsApp': {
                    templateProvider:
                        function ($rootScope, $http) {
                            if($rootScope.user.tipo=='estudiante'){
                                return $http.get('partials/content/asignatura/curso/preguntas/preguntasEstudiante.html')
                                    .then(function (template) {
                                        return  template.data;
                                    });
                            }else if($rootScope.user.tipo=='profesor'){
                                return $http.get('partials/content/asignatura/curso/preguntas/preguntasProfesor.html')
                                    .then(function (template) {
                                        return  template.data;
                                    });
                            }
                        }
                }
            },
            authenticate:true
        })
        .state('crsApp.asignatura.curso.actividades', {
            url: '/actividades',
            views: {
                'main@crsApp': {
                    templateProvider:
                        function ($rootScope, $http) {
                            if($rootScope.user.tipo=='estudiante'){
                                return $http.get('partials/content/asignatura/curso/actividades/actividadesEstudiante.html')
                                    .then(function (template) {
                                        return  template.data;
                                    });
                            }else if($rootScope.user.tipo=='profesor'){
                                return $http.get('partials/content/asignatura/curso/actividades/actividadesProfesor.html')
                                    .then(function (template) {
                                        return  template.data;
                                    });
                            }
                        }
                }
            },
            authenticate:true
        })
        .state('crsApp.asignatura.curso.info', {
            url: '/info',
            views: {
                'main@crsApp': {
                    templateProvider:
                        function ($rootScope, $http) {
                            if($rootScope.user.tipo=='estudiante'){
                                return $http.get('partials/content/asignatura/curso/info/informacionEstudiante.html')
                                    .then(function (template) {
                                        return  template.data;
                                    });
                            }else if($rootScope.user.tipo=='profesor'){
                                return $http.get('partials/content/asignatura/curso/info/informacionProfesor.html')
                                    .then(function (template) {
                                        return  template.data;
                                    });
                            }
                        }
                }
            },
            authenticate:true
        })
        .state('crsApp.asignatura.curso.config', {
            url: '/config',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/asignatura/curso/config/config.html'
                }
            },
            authenticate:true
        })
        .state('crsApp.espectador', {
            url:'espectador/:nombre_asignatura/:id_sesion',
            views:
                {
                    "menu@crsApp": {
                    templateUrl: ''
                },
                'main@crsApp':{
                    templateUrl: 'partials/content/asignatura/curso/espectador.html'
                }
            },
            spectator: true
        });
});
crsApp.run(function($rootScope, $state, $location, SessionServices, SocketServices){
    $rootScope.$on('$stateChangeStart', function(event, toState){
        var dataSesion=SessionServices.getSessionData();
        if(toState.authenticate && !toState.admin){
            SessionServices.checkToken().then(function (data) {
                if(data.credencial){
                    $rootScope.user = dataSesion;
                }else{
                    event.preventDefault();
                    $state.transitionTo("crsApp.login");
                }
            });
        }else if(toState.authenticate && toState.admin){
            SessionServices.checkToken().then(function (data) {
                if(data.credencial){
                    $rootScope.user = SessionServices.getSessionData();
                    if($rootScope.user.tipo!='administrador'){
                            event.preventDefault();
                            $state.transitionTo("crsApp");
                    }
                }
            });
        }else if(toState.spectator){
            var sesion_id = $location.path().split("/")[3]||0;
            SocketServices.emit('ingresoEspectador',{
                sesion_id:sesion_id
            });
        }
    });
});
