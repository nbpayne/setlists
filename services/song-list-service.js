// Song List Service
setListApp.factory('SongListService', ['SongListResource', function (SongListResource) {
  return {
    getSongList: function(songListID, callback) {
      var svc = this;

      SongListResource.get({ songListID: songListID }, function(data) {
        var songList = new Object();
        songList.data = data;
        callback(songList);
        svc.saveSongList(songList, false);
      }, function (response) {
        // If failure get from local storage
        var songList = angular.fromJson(localStorage['songList_' + songListID]);
        if (songList == undefined) { 
          songList = new Object();
          songList.data = [] 
        };
        callback(songList);
      })
    }, 
    saveSongList: function (songList, dirty) {
      // Save to local storage
      if (dirty == undefined) { dirty = true };
      songList.isDirty = dirty;
      localStorage['songList_' + songList.data._id] = angular.toJson(songList);
    }, 
    saveSongListToServer: function (songList) {
      // Save to server
      var svc = this;
      console.log('Save song list to server!');
      SongListResource.update({ songListID: songList.data._id }, songList.data, function (data) {
        svc.saveSongList(songList, false);
        console.log(data);
      }, function (data) {
        console.log(data);
      });
    }
  } 
}]);
