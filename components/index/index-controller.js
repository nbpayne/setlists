// Index Controller
setListApp.controller('IndexCtrl', ['$scope', 'UserService', 'VERSION', 
  function ($scope, UserService, VERSION) {
    $scope.version = VERSION;
    
    if(UserService.isLoggedIn) {
      $scope.user = UserService.name //+ ' - ' + UserService.band;
    } else {
      $scope.user = undefined;
    }

    $scope.$on('authenticate', function (event, args) {
      if(args.authenticated) {
        $scope.user = UserService.name //+ ' - ' + UserService.band
      } else {
        $scope.user = undefined;
      }
    })
  }
])
