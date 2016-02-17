// Set List Service
setListApp.factory('SetListService', ['SetListResource', function(SetListResource) {
  return {
    getSetLists: function(callback) {
      var svc = this;

      SetListResource.query({ }, function(data) {
        var setLists = new Object();
        setLists.data = data;
        callback(setLists);
        svc.saveSetLists(setLists, false);
      }, function (response) {
        // If failure get from local storage
        var setLists = angular.fromJson(localStorage['setLists']);
        if (setLists == undefined) { 
          var setLists = new Object();
          setLists.data = [] 
        };
        callback(setLists);
      })
    },
    saveSetLists: function (setLists) {
      // Save to local storage
      localStorage['setLists'] = angular.toJson(setLists);
      // TODO: How do I clean up localStorage?
    }, 
    getSetList: function(setListID, callback) {
      var svc = this;

      SetListResource.get({ setListID: setListID }, function(data) {
        var setList = new Object();
        setList.data = data;
        callback(setList);
        svc.saveSetList(setList, false);
      }, function (response) {
        // If failure get from local storage
        var setList = angular.fromJson(localStorage['setList_' + setListID]);
        if (setList == undefined) { 
          var setList = new Object();
          setList.data = [] 
        };
        callback(setList);
      })
    }, 
    saveSetList: function(setList, dirty) {
      // Save to local storage
      if (dirty == undefined) { dirty = true };
      setList.isDirty = dirty;
      localStorage['setList_' + setList.data._id] = angular.toJson(setList);
    }, 
    saveSetListToServer: function (setList) {
      // Save to server
      var svc = this;
      console.log('Save set list to server!');
      SetListResource.update({ setListID: setList.data._id }, setList.data, function (data) {
        svc.saveSetList(setList, false);
        console.log(data);
      }, function (data) {
        console.log(data);
      });
    }, 
    deleteSetList: function (setListID) {
      // Save to laundry list in local storage
      //console.log('Save set list to dirty laundry list in local storage');
      var dirtyLaundry = angular.fromJson(localStorage['dirtyLaundry']);
      if (dirtyLaundry == undefined) { dirtyLaundry = [] };
      dirtyLaundry.push(setListID);
      localStorage['dirtyLaundry'] = angular.toJson(dirtyLaundry);
    }, 
    deleteSetListFromServer: function (setListID) {
      var svc = this;
      console.log('Delete set list from server');
      SetListResource.delete({ setListID: setListID }, function(data) {
        // Remove set list from laundry list - here or in synchroniser?
        var dirtyLaundry = angular.fromJson(localStorage['dirtyLaundry']);
        dirtyLaundry.splice(dirtyLaundry.indexOf(setListID), 1);
        localStorage['dirtyLaundry'] = angular.toJson(dirtyLaundry);
        console.log(data);
      }, function (data) {
        console.log(data);
      });
    }
  }
}]);
