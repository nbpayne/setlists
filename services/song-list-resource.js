// Song List Resource
setListApp.factory('SongListResource', ['$resource', 'API', function ($resource, API) {
  return $resource(API + '/song-lists/:songListID', {}, { update: { method: 'PUT' } });
}]);
