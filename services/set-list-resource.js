// Set List Resource
setListApp.factory('SetListResource', ['$resource', 'API', function ($resource, API) {
  return $resource(API + '/set-lists/:setListID', {}, { update: { method: 'PUT' } });
}]);
