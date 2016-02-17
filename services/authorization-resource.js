// Authorization Resource
setListApp.factory('AuthorizationResource', ['$resource', 'API', function ($resource, API) {
  return $resource(API + '/authorizations/:accessToken')
}])
