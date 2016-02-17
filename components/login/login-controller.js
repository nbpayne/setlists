// Login controller
setListApp.controller('LoginCtrl', ['$scope', 'UserService', '$state', '$window', '$facebook', 
  function ($scope, UserService, $state, $window, $facebook) {
    $scope.authenticated = UserService.isLoggedIn;
    
    // Listen for authentication coming back from FB
    $scope.$on('authenticate', function (event, args) {
      $scope.authenticated = args.authenticated;
    })

    // Force parse of xfbml
    $facebook.parse()

  }
])
