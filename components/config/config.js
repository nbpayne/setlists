(function() {
  'use strict';

  angular.module('SetListApp.config', [])
    .constant('API', 'https://set-lists-api-1224.appspot.com')
    .constant('ENV', 'production')
    .constant('FB_APPID', '426184434182003')
    .constant('ROLLBAR_ID', 'cb9ce30fe9934a34b6e256c84fd4c029');

})();
