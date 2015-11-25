// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
//angular.module('myTrip', ['ionic','ng-mfb'])

angular.module('todoApp', ['ionic','ngCordova','ng-mfb','todoApp.controllers','todoApp.services'])

.run(function($ionicPlatform,$state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    /*if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }*/
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    $state.go('todos');
    //"YOUR APP ID", "JAVASCRIPT KEY"
    Parse.initialize("iTwpohuMLeF5sMxPFK7iiWWoagcUnoNcRr5G7zjX", "aReF1HkdLjQtpEdZy3xvFVxuYiL8H5Fa9qmqCv95");

  });
}).config(function($stateProvider, $urlRouterProvider){
        $stateProvider.state('todos',{
           url:'/todos',
           controller:'TodoListController',
           templateUrl:'views/todos.html'
        }).state('createTodo',{
            url:'/todo/new',
            controller:'TodoCreationController',
            templateUrl:'views/create-todo.html'
        }).state('editTodo',{
            url:'/todo/edit/:id/:tripName/:startAt/:endAt/:content',
            controller:'TodoEditController',
            templateUrl:'views/edit-todo.html'
        }).state('signup', {
            url: '/signup',
            templateUrl: 'views/sign-up.html',
            controller: 'LoginCtrl'
        }).state('signin', {
            url: '/signin',
            templateUrl: 'views/signin.html',
            controller: 'LoginCtrl'
          }).state('settings', {
            url: '/settings',
            templateUrl: 'views/settings.html',
            controller: 'LoginCtrl'
          }).state('map', {
            url: '/map',
            templateUrl: 'views/map.html',
            controller: 'LoginCtrl'
          }).state('locations', {
            url: '/locations',
            templateUrl: 'views/locations.html',
            controller: 'LocationListController'
          }).state('createLocation', {
            url: '/locations/new',
            templateUrl: 'views/create-location.html',
            controller: 'LocationCreationController'
          });
         
          $urlRouterProvider.otherwise("/signin");
});
