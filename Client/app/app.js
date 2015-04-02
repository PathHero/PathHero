'use strict';
/**
 * @ngdoc overview
 * @name PathHero
 * @description
 */
var app = angular
  .module('PathHero', [
  'ui.router',
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngTouch',
  'ngMaterial',
  'ngSanitize',
  'ngAria'
]);

  // ********************** Route Definitions ********************** 
app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  // ********************** Dashboard **********************
  .state('create', {
    url: '/create',
    views: {
        'create': {
            templateUrl: 'create/create.html',
            controller: 'CreateCtrl'
        },
        'map@create': {
            templateUrl: 'create/map.html'
        }
    }
  });    
}]);
