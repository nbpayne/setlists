// Set List controller
setListApp.controller('SetListCtrl', [
    '$scope', 
    '$stateParams', 
    '$filter', 
    'SongListService', 
    'SetListService', 
    'SynchronisationService', 
    '$modal', 
    '$log', 
  function (
      $scope, 
      $stateParams, 
      $filter, 
      SongListService, 
      SetListService, 
      SynchronisationService, 
      $modal, 
      $log) {

    // Add song to set list
    $scope.addSong = function () {
      $scope.setList.data.songs.push(this.song);
      SetListService.saveSetList($scope.setList);

      // DEBUG
      //console.log($scope.setList.data.songs);
    };

    // Add first song in song list to set list
    $scope.addNewSong = function () {
      var song = $filter('filter')($scope.songList.data.songs, $scope.search)[0];
      if (song == null) { 
        song = { 
          _id: ObjectId(), 
          name: $scope.search 
        };
        $scope.songList.data.songs.push(song);
        SongListService.saveSongList($scope.songList);
      };
      $scope.setList.data.songs.push(song);
      $scope.search = null;
      SetListService.saveSetList($scope.setList);

      // DEBUG
      //console.log($scope.setList.data.songs);
    }

    // Remove song from set list
    $scope.removeSong = function () {
      $scope.setList.data.songs.splice(this.$index, 1);
      SetListService.saveSetList($scope.setList);

      // DEBUG
      //console.log($scope.setList.data.songs);
    }

    // Handle the drop event and pass to move a song
    $scope.onDropComplete = function (i, d, e) {
      $scope.moveSong($scope.setList.data.songs.indexOf(d), i);
    }

    // Move a song
    $scope.moveSong = function (from, to) {
      // No change
      if (from == to) { return };

      // Move it!
      $scope.setList.data.songs.splice(to, 0, $scope.setList.data.songs.splice(from, 1)[0]);
      SetListService.saveSetList($scope.setList);
    }

    // Delete a song from the song list
    $scope.deleteSong = function () {
      // Are you sure?
      // Remove from set list
      // Remove from song list
      // $scope.songList.splice(this.$index, -1);

      // TODO: Save to server
    }

    // Edit a song
    $scope.editSong = function () {
      this.song.edit = true;
    }

    // Save song edit
    $scope.saveSong = function () {
      this.song.edit = false;
      SongListService.saveSongList($scope.songList);
      SetListService.saveSetList($scope.setList);
    }

    // Edit a set list
    $scope.editSetList = function() {
      // Copy set list to a temporary one
      var tmpSetList = new Object();
      tmpSetList.data = new Object();
      tmpSetList.data._id = $scope.setList.data._id;
      tmpSetList.data.date = $scope.setList.data.date;
      tmpSetList.data.venue = $scope.setList.data.venue;
      tmpSetList.data.songListID = $scope.setList.data.songListID;
      tmpSetList.data.songs = $scope.setList.data.songs;

      var modalInstance = $modal.open({
        templateUrl: 'components/set-list-modal/set-list-modal.html', 
        controller: 'SetListModalCtrl', 
        windowClass: 'small', 
        resolve: {
          setList: function () {
            return tmpSetList;
          }
        }
      });

      modalInstance.result.then(function (setList) {
        // Update UI and save set list to local storage
        $scope.setList = setList;
        SetListService.saveSetList($scope.setList);
      }, function (reason) {
        $log.info(reason);
      });
    }

    // Shutdown synchroniser
    $scope.$on('$destroy', function() {
      // Make sure that the interval is destroyed too
      SynchronisationService.stopSetListSynchroniser();
    });

    // Get set list from server
    SetListService.getSetList($stateParams.setListID, function (setList) {
      // Get the song lis
      SongListService.getSongList(setList.data.songListID, function(songList) {
        $scope.songList = songList

        // Create empty set list to bind to the UI
        $scope.setList = new Object();
        $scope.setList.data = new Object();

        // Copy temp set list to our scope set list
        $scope.setList.data._id = setList.data._id;
        $scope.setList.data.date = setList.data.date;
        $scope.setList.data.venue = setList.data.venue;
        $scope.setList.data.songListID = setList.data.songListID;
        $scope.setList.data.songs = [];

        // Build set list  into scope from song list so that the songs are connected
        for (var i = 0; i < setList.data.songs.length; i++) {
          var matchedSongs = $.grep($scope.songList.data.songs, function(e) { return e._id === setList.data.songs[i]._id; });
          $scope.setList.data.songs.push(matchedSongs[0]);
        };
      });
    });

    // Start synchroniser
    SynchronisationService.startSetListSynchroniser();

  }
]);
