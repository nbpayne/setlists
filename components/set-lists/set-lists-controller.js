// Set Lists controller
setListApp.controller('SetListsCtrl', [
    '$scope', 
    '$filter',
    'SetListService', 
    'futureFilter', 
    '$state', 
    'SynchronisationService', 
    '$modal',
    '$log', 
    'UserService', 
  function (
    $scope, 
    $filter, 
    SetListService, 
    futureFilter, 
    $state, 
    SynchronisationService, 
    $modal, 
    $log, 
    UserService) {
    // Create a new set list
    $scope.createSetList = function() {
      $scope.setList = new Object();
      $scope.setList.data = new Object();
      $scope.setList.data._id = ObjectId();

      var modalInstance = $modal.open({
        templateUrl: 'components/set-list-modal/set-list-modal.html', 
        controller: 'SetListModalCtrl', 
        windowClass: 'small', 
        resolve: {
          setList: function () {
            return $scope.setList;
          }
        }
      });

      modalInstance.result.then(function (setList) {
        // Add new set list to set lists
        $scope.setList.data.venue = setList.data.venue;
        $scope.setList.data.date = setList.data.date;
        $scope.setLists.data.push($scope.setList.data);
        // Save to local storage
        SetListService.saveSetLists($scope.setLists);
        // Add songs to set list
        $scope.setList.data.songListID = UserService.songListID;
        $scope.setList.data.songs = [];
        // Save set list to local storage
        SetListService.saveSetList($scope.setList, true);
        // Open the set list page
        $state.transitionTo('set-list', {'setListID': $scope.setList.data._id });
      }, function (reason) {
        $log.info(reason);
      });
    }

    $scope.deleteSetList = function () {
      SetListService.deleteSetList(this.setList._id);
      $scope.setLists.data.splice($scope.setLists.data.indexOf(this.setList), 1);
    }

    // Shutdown syncrhoniser
    $scope.$on('$destroy', function() {
      // Make sure that the interval is destroyed too
      SynchronisationService.stopSetListsSynchroniser();
    });

    // Get the list of set lists
    SetListService.getSetLists(function(setLists) {
      $scope.setLists = setLists;
    })

    // Start synchroniser
    SynchronisationService.startSetListsSynchroniser();

  }
]);
