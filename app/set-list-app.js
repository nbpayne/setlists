// Set list
var setListApp = angular.module('SetListApp', ['ngResource', 'ui.router', 'mm.foundation', 'facebook', 'ngDraggable', 'my.config']);

setListApp.constant('VERSION', '0.11.1');

setListApp.config(['$stateProvider', '$urlRouterProvider', '$facebookProvider', 'FB_APPID', 
  function ($stateProvider, $urlRouterProvider, $facebookProvider, FB_APPID) {
  // Routing
  $stateProvider
  .state('login', {
    url: '/login', 
    templateUrl: 'components/login/login.html', 
    controller: 'LoginCtrl', 
    secure: false
  })
  .state('set-lists', {
    url: '/set-lists', 
    templateUrl: 'components/set-lists/set-lists.html',
    controller: 'SetListsCtrl', 
    secure: true
  })
  .state('set-list', {
    url: '/set-lists/:setListID', 
    templateUrl: 'components/set-list/set-list.html',
    controller: 'SetListCtrl', 
    secure: true
  });

  $urlRouterProvider.otherwise('/set-lists');

  $facebookProvider.init({
      appId: FB_APPID,
      status: true,
      cookies: false,
      xfbml: false
  });
  
}]);

setListApp.run(['$rootScope', 'UserService', '$state', '$facebook', 
  function ($rootScope, UserService, $state, $facebook) {
  // Enforce security
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    if(toState.secure && !UserService.isLoggedIn) {
      $state.transitionTo('login');
      event.preventDefault();
    }
  })

  // Init authentication
  $rootScope.$on('facebook.auth.authResponseChange', function(event, response) {
    if (response.status === 'connected') {
      console.log(response)
      UserService.login(response.authResponse, function() {
        $rootScope.$broadcast('authenticate', { 'authenticated': true })
      })
    } else {
      console.log(response.status)
      UserService.logout(function () {
        $rootScope.$broadcast('authenticate', { 'authenticated': false })
      })
    }
  })

}]);
