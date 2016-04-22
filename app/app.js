'use strict';

var crsApp = angular.module('crsApp', [
    'ui.router',
    'ngAnimate',
    'ngStorage',
    'ngMaterial',
    'md.data.table',
    'toastr',
    'nvd3'
]);

crsApp.config(function($stateProvider, $urlRouterProvider, toastrConfig) {
    angular.extend(toastrConfig, {
        allowHtml: false,
        closeButton: false,
        closeHtml: '<button>&times;</button>',
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
        progressBar: false,
        tapToDismiss: true,
        templates: {
            toast: 'directives/toast/toast.html',
            progressbar: 'directives/progressbar/progressbar.html'
        },
        timeOut: 5000,
        titleClass: 'toast-title',
        toastClass: 'toast'
    });
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('crsApp', {
            url: '/',
            views: {
                "header": {
                    templateUrl: 'partials/content/header/header.html'
                },
                "content": {
                    templateUrl: 'partials/content/content.html'
                },
                "menu@crsApp": {
                    templateUrl: 'partials/content/menu/menu.html'
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
            url: '/:ano/:semestre/:id_curso',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/asignatura/curso/cursoGeneral.html'
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
                                return $http.get('partials/content/asignatura/curso/clases/sesion/pregunta/_estudianteSesionPartial.html')
                                    .then(function (template) {
                                        return  template.data;
                                    });
                            }else if($rootScope.user.tipo=='profesor'){
                                return $http.get('partials/content/asignatura/curso/clases/sesion/sesionPartial.html')
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
                    templateUrl: 'partials/content/asignatura/curso/clases/sesion/pregunta/preguntaPartial.html'
                }
            },
            authenticate:true
        })
        .state('crsApp.asignatura.curso.preguntas', {
            url: '/preguntas',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/asignatura/curso/preguntas/preguntas.html'
                }
            },
            authenticate:true
        })
        .state('crsApp.asignatura.curso.actividades', {
            url: '/actividades',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/asignatura/curso/actividades/actividades.html'
                }
            },
            authenticate:true
        })
        .state('crsApp.asignatura.curso.info', {
            url: '/info',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/asignatura/curso/info/info.html'
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
        });
});
crsApp.run(function($rootScope, $state, SessionServices){
    $rootScope.$on('$stateChangeStart', function(event, toState){
        if(toState.authenticate){
            SessionServices.checkToken().then(function (data) {
                if(data.credencial){
                    $rootScope.user = SessionServices.getSessionData();
                }else{
                    event.preventDefault();
                    $state.transitionTo("crsApp.login");
                }
            });
        }
    });
});
