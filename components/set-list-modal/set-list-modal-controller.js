// Set List Modal Controller
setListApp.controller('SetListModalCtrl', ['$scope',  '$modalInstance', 'setList', 
  function ($scope, $modalInstance, setList) {
    // Bind to UI
    $scope.setList = setList;

    // Cancel!
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    }

    // Save
    $scope.save = function () {
      console.log('saveSetList called');
      $modalInstance.close(this.setList);
    }
  }
]);
