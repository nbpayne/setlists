// User Service
setListApp.factory('UserService', ['AuthorizationResource', '$http', function (AuthorizationResource, $http) {
  return {
    isLoggedIn: false, 
    name: undefined,
    band: undefined, 
    songListID: undefined,
    login: function(authResponse, callback) {
      var svc = this;

      AuthorizationResource.get({ accessToken: authResponse.accessToken}, function (data) {
        svc.isLoggedIn = true;
        svc.name = data.firstName + ' ' + data.lastName;
        svc.band = data.band;
        svc.songListID = data.songListID;
        $http.defaults.headers.common['auth-token'] = data.authToken;
        callback();
      }, function (response) {
        console.log(response);
      })
    }, 
    logout: function (callback) {
      this.isLoggedIn = false; 
      this.name = undefined; 
      this.band = undefined;  
      this.songListID = undefined;

      AuthorizationResource.delete({ accessToken: '4321'}, function (data) {
        console.log('Authorization deleted from server');
        delete $http.defaults.headers.common['auth-token'];
        callback();
      }, function (response) {
        console.log(response);
        delete $http.defaults.headers.common['auth-token'];
        callback();
      })
    }
  }
}]);
