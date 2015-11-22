'use strict';

var crsApp = angular.module('crsApp', [
    'ui.router',
    'ngAnimate',
    'agGrid',
    'ngStorage',
    'ui.bootstrap'
]);

crsApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('crsApp', {
            url: '/',
            views: {
                "header": {
                    templateUrl: 'partials/header/header.html'
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
        .state('crsApp.cursosSemestre', {
            url: 'cursos/:semestre',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/semestre/cursosSemestre.html'
                }
            },
            authenticate:true
        })
        .state('crsApp.cursosSemestre.curso', {
            url: '/:curso',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/curso/cursoGeneral.html'
                }
            },
            authenticate:true
        })
        .state('crsApp.cursosSemestre.clases', {
            url: '/:curso/clases',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/clases/clases.html'
                }
            },
            authenticate:true
        })
        .state('crsApp.cursosSemestre.clases.sesion', {
            url: '/sesion/:id_sesion',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/clases/sesion/sesionPartial.html'
                }
            },
            authenticate:true
        })
        .state('crsApp.cursosSemestre.preguntas', {
            url: '/:curso/preguntas',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/preguntas/preguntas.html'
                }
            },
            authenticate:true
        })
        .state('crsApp.cursosSemestre.actividades', {
            url: '/:curso/actividades',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/actividades/actividades.html'
                }
            },
            authenticate:true
        })
        .state('crsApp.cursosSemestre.info', {
            url: '/:curso/info',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/info/info.html'
                }
            },
            authenticate:true
        })
        .state('crsApp.cursosSemestre.config', {
            url: '/:curso/config',
            views: {
                'main@crsApp': {
                    templateUrl: 'partials/content/config/config.html'
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
                    //$state.transitionTo("crsApp");
                }else{
                    event.preventDefault();
                    $state.transitionTo("crsApp.login");
                }
            });
        }
    });
});