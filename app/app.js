'use strict';

var crsApp = angular.module('crsApp', [
  'ui.router',
  'ui.bootstrap'
]);

crsApp.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('crsApp',{
    url: '/',
    views: {
      header: {
        templateUrl: 'partials/header/header.html'
      },
      menu:{
        templateUrl: 'partials/menu/menu.html'
      },
      content: {
        templateUrl: 'partials/content/content.html'
      }
    }
  });

});
