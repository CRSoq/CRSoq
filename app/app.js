'use strict';

var crsApp = angular.module('crsApp', [
  'ui.router',
  'ui.bootstrap'
]);

crsApp.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('crsApp',{
    url: '',
    views: {
      header: {
        templateUrl: '/header/header.html',
        controller: '/header/HeaderController.js'
      },
      menu:{
        templateUrl: '/menu/menu.html',
        controller: '/menu/MenuController.js'
      },
      content: {
        templateUrl: '',
        controller: ''
      },
      footer: {
        templateUrl: ''
      }
    }
  });

});
