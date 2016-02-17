// Server synchronisation service
setListApp.factory('SynchronisationService', ['$interval', 'SongListService', 'SetListService', '$stateParams', 
  function ($interval, SongListService, SetListService, $stateParams) {
    var synchroniser;
    return { 
      startSetListSynchroniser: function () {
        synchroniser = $interval(function () {
          // Only run if we have a setListID
          if ($stateParams.setListID) {
            // Check dirtiness of song list
            var songList = angular.fromJson(localStorage['songList_' + angular.fromJson(localStorage['setList_' + $stateParams.setListID]).data.songListID]);
            if (songList != undefined && songList.isDirty) {
              SongListService.saveSongListToServer(songList);
            };

            // Check dirtiness of set list
            // TODO: Get set list from local storage by ID
            var setList = angular.fromJson(localStorage['setList_' + $stateParams.setListID]);
            if (setList != undefined && setList.isDirty) {
              SetListService.saveSetListToServer(setList);
            } 
          }
        }, 2000);
      }, 
      stopSetListSynchroniser: function () {
        $interval.cancel(synchroniser);
      },
      startSetListsSynchroniser: function () {
        synchroniser = $interval(function () {
          // Get dirty laundry from local storage
          var dirtyLaundry = angular.fromJson(localStorage['dirtyLaundry']);
          if (dirtyLaundry != undefined) {
            for (var i = 0; i < dirtyLaundry.length; i++) {
              SetListService.deleteSetListFromServer(dirtyLaundry[i]);
            }
          }
        }, 2000);
        
      }, 
      stopSetListsSynchroniser: function () {
        $interval.cancel(synchroniser);
      }
    }
  }
]);
