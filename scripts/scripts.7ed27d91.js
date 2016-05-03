!function(){"use strict";function a(a,b,c,d,e,f,g){g.init({accessToken:f,verbose:"development"===d,captureUncaught:!0,payload:{environment:d}}),b.state("login",{url:"/login",templateUrl:"components/login/login.html",controller:"Login",controllerAs:"vm",secure:!1}).state("authorize",{url:"/authorize",templateUrl:"components/authorize/authorize.html",controller:"Authorize",controllerAs:"vm",secure:!1}).state("set-lists",{url:"/set-lists",templateUrl:"components/set-lists/set-lists.html",controller:"SetLists",controllerAs:"vm",secure:!0}).state("set-list",{url:"/set-lists/:setListID",templateUrl:"components/set-list/set-list.html",controller:"SetList",controllerAs:"vm",secure:!0}),c.otherwise("/set-lists"),a.init({appId:e,status:!0,cookies:!1,xfbml:!1,version:"v2.6"})}function b(a,b,c,d,e,f){var g=f.user();g&&e.configure({payload:{person:{id:g.id}}}),b.$on("$stateChangeStart",function(a,b,e,f,h){d.location.search?d.location.search.includes("?code=")?d.location.href=d.location.origin+d.location.pathname+"#/authorize":d.location.href=d.location.origin+d.location.pathname+"#/set-lists":b.secure&&!g.isLoggedIn&&(c.transitionTo("login"),a.preventDefault())}),b.$on("authenticate",function(a,b){b.authenticated?c.transitionTo("set-lists"):(e.configure({payload:{person:{id:g.id}}}),c.transitionTo("login"))}),b.$on("authorize",function(a,b){f.logout()})}angular.module("SetListApp",["angular-momentjs","facebook","ngDraggable","ngResource","SetListApp.config","tandibar/ng-rollbar","ui.bootstrap","ui.bootstrap.datetimepicker","ui.router"]).constant("VERSION","0.19.1").config(a).run(b),a.$inject=["$facebookProvider","$stateProvider","$urlRouterProvider","ENV","FB_APPID","ROLLBAR_ID","RollbarProvider"],b.$inject=["$facebook","$rootScope","$state","$window","Rollbar","UserService"]}(),function(){"use strict";angular.module("SetListApp").filter("future",function(){return function(a){var b=[];return angular.forEach(a,function(a){Date.parse(a.date)>=Date.parse(Date())&&b.push(a)}),b}})}(),function(){"use strict";angular.module("SetListApp").filter("past",function(){return function(a){var b=[];return angular.forEach(a,function(a){Date.parse(a.date)<Date.parse(Date())&&b.push(a)}),b}})}(),function(){"use strict";function a(a,b){return a(b+"/authorizations/:accessToken")}angular.module("SetListApp").factory("AuthorizationResource",a),a.$inject=["$resource","API"]}(),function(){"use strict";function a(){function a(){if("undefined"!=typeof localStorage){var a=parseInt(localStorage.mongoMachineId);a>=0&&16777215>=a&&(e=Math.floor(localStorage.mongoMachineId)),localStorage.mongoMachineId=e}}function b(){var a=Math.floor((new Date).valueOf()/1e3);c++,c>16777215&&(c=0);var b=a.toString(16),f=e.toString(16),g=d.toString(16),h=c.toString(16);return"00000000".substr(0,8-b.length)+b+"000000".substr(0,6-f.length)+f+"0000".substr(0,4-g.length)+g+"000000".substr(0,6-h.length)+h}var c=0,d=Math.floor(32767*Math.random()),e=Math.floor(16777216*Math.random()),f={getObjectId:b};return a(),f}angular.module("SetListApp").service("ObjectIdService",a)}(),function(){"use strict";function a(a,b){return a(b+"/set-lists/:setListID",{},{update:{method:"PUT"}})}angular.module("SetListApp").factory("SetListResource",a),a.$inject=["$resource","API"]}(),function(){"use strict";function a(a,b){return a(b+"/song-lists/:songListID",{},{update:{method:"PUT"}})}angular.module("SetListApp").factory("SongListResource",a),a.$inject=["$resource","API"]}(),function(){"use strict";function a(a,b,c,d){function e(){var b=angular.fromJson(localStorage.authorization);return b?(a.defaults.headers.common["auth-token"]=b.authToken,{isLoggedIn:!0,id:b._id,name:b.firstName+" "+b.lastName,band:b.band,songListID:b.songListID}):{isLoggedIn:!1,id:void 0,name:void 0,band:void 0,songListID:void 0}}function f(a){c.get({accessToken:a.accessToken},function(a){localStorage.authorization=angular.toJson(a),b.$broadcast("authenticate",{authenticated:!0})},function(a){d.warning("login failed to get the authorization from the server",a)})}function g(){var c=angular.fromJson(localStorage.authorization);c&&(localStorage.removeItem("authorization"),delete a.defaults.headers.common["auth-token"],b.$broadcast("authenticate",{authenticated:!1}))}return{user:e,login:f,logout:g}}angular.module("SetListApp").service("UserService",a),a.$inject=["$http","$rootScope","AuthorizationResource","Rollbar"]}(),function(){"use strict";function a(a,b,c,d){function e(){console.log("Set list synchroniser started"),i=a(function(){if(d.setListID){var a=angular.fromJson(localStorage["songList_"+angular.fromJson(localStorage["setList_"+d.setListID]).data.songListID]);void 0!==a&&a.isDirty&&b.saveSongListToServer(a);var e=angular.fromJson(localStorage["setList_"+d.setListID]);void 0!==e&&e.isDirty&&c.saveSetListToServer(e)}},2e3)}function f(){console.log("Set list synchroniser stopped"),a.cancel(i)}function g(){console.log("Set lists synchroniser started"),i=a(function(){var a=angular.fromJson(localStorage.dirtyLaundry);if(void 0!==a)for(var b=0;b<a.length;b++)c.deleteSetListFromServer(a[b])},2e3)}function h(){console.log("Set lists synchroniser stopped"),a.cancel(i)}var i;return{startSetListSynchroniser:e,stopSetListSynchroniser:f,startSetListsSynchroniser:g,stopSetListsSynchroniser:h}}angular.module("SetListApp").service("SynchronisationService",a),a.$inject=["$interval","SongListService","SetListService","$stateParams"]}(),function(){"use strict";function a(a,b,c){function d(d){console.log("Get set lists from the server"),c.query({},function(a){var b={};b.data=a,d(b),e(b,!1)},function(c){if(401===c.status)a.$broadcast("authorize",{authorized:!1});else{var e=angular.fromJson(localStorage.setLists);void 0===e&&(e={},e.data=[]),d(e),b.warning("getSetLists failed to get set lists -- set lists gotten from localStorage",c)}})}function e(a){localStorage.setLists=angular.toJson(a)}function f(d,e){console.log("Get set list from the server"),c.get({setListID:d},function(a){var b={};b.data=a,e(b),g(b,!1)},function(c){if(401===c.status)a.$broadcast("authorize",{authorized:!1});else{var f=angular.fromJson(localStorage["setList_"+d]);void 0===f&&(f={},f.data=[]),e(f),b.warning("getSetList failed to get set list -- set lists gotten from localStorage",c)}})}function g(a,b){console.log("Save set list to localStorage"),void 0===b&&(b=!0),a.isDirty=b,localStorage["setList_"+a.data._id]=angular.toJson(a)}function h(d){console.log("Save set list to server!"),c.update({setListID:d.data._id},d.data,function(a){g(d,!1)},function(c){401===c.status?a.$broadcast("authorize",{authorized:!1}):b.warning("saveSetListToServer failed to save the set list to the server",c)})}function i(a){console.log("Save set list to dirty laundry list in local storage");var b=angular.fromJson(localStorage.dirtyLaundry);void 0===b&&(b=[]),b.push(a),localStorage.dirtyLaundry=angular.toJson(b)}function j(d){console.log("Delete set list from server"),c["delete"]({setListID:d},function(a){var b=angular.fromJson(localStorage.dirtyLaundry);b.splice(b.indexOf(d),1),localStorage.dirtyLaundry=angular.toJson(b)},function(c){401===c.status?a.$broadcast("authorize",{authorized:!1}):b.warning("deleteSetListFromServer failed to delete the set list from the server",c)})}return{getSetLists:d,saveSetLists:e,getSetList:f,saveSetList:g,saveSetListToServer:h,deleteSetList:i,deleteSetListFromServer:j}}angular.module("SetListApp").service("SetListService",a),a.$inject=["$rootScope","Rollbar","SetListResource"]}(),function(){"use strict";function a(a,b,c){function d(d,f){console.log("Get song list from the server"),c.get({songListID:d},function(a){var b={};b.data=a,f(b),e(b,!1)},function(c){if(401===c.status)a.$broadcast("authorize",{authorized:!1});else{var e=angular.fromJson(localStorage["songList_"+d]);void 0===e&&(e={},e.data=[]),f(e),b.warning("getSongList failed to get the song list -- song list gotten from localStorage")}})}function e(a,b){console.log("Save song list to local storage"),void 0===b&&(b=!0),a.isDirty=b,localStorage["songList_"+a.data._id]=angular.toJson(a)}function f(d){console.log("Save song list to server!"),c.update({songListID:d.data._id},d.data,function(a){e(d,!1)},function(c){401===c.status?a.$broadcast("authorize",{authorized:!1}):b.warning("saveSongListToServer failed to save the song list to the server",c)})}return{getSongList:d,saveSongList:e,saveSongListToServer:f}}angular.module("SetListApp").service("SongListService",a),a.$inject=["$rootScope","Rollbar","SongListResource"]}(),function(){"use strict";function a(a,b,c,d,e){function f(){a.getLoginStatus().then(function(a){"connected"===a.status?d.login(a.authResponse):d.logout()},function(a){e.warning("$facebook.getLoginStatus failed to return a response",a),b.transitionTo("login")})}f()}angular.module("SetListApp").controller("Authorize",a),a.$inject=["$facebook","$state","FB_APPID","UserService","Rollbar"]}(),function(){"use strict";function a(a,b,c){function d(a,b){f.location=b.split("?")[0]}function e(){b.logout(function(){})}var f=this;f.location=void 0,f.logout=e,f.version=c,a.$on("$locationChangeSuccess",d)}angular.module("SetListApp").controller("Index",a),a.$inject=["$scope","UserService","VERSION"]}(),function(){"use strict";function a(a,b,c,d,e){function f(){g.loading=!0,a.getLoginStatus().then(function(a){"connected"===a.status?e.login(a.authResponse):b.location.href="https://www.facebook.com/dialog/oauth?client_id="+c+"&redirect_uri="+b.location.origin+b.location.pathname},function(a){d.warning("$facebook.getLoginStatus failed to return a response",a),g.loading=!1})}var g=this;g.loading=!1,g.login=f}angular.module("SetListApp").controller("Login",a),a.$inject=["$facebook","$window","FB_APPID","Rollbar","UserService"]}(),function(){"use strict";function a(a,b,c,d,e,f,g,h,i,j){function k(){h.getSetList(d.setListID,l),j.startSetListSynchroniser(),c.$on("$destroy",function(){j.stopSetListSynchroniser()})}function l(a){i.getSongList(a.data.songListID,function(b){function c(b){return b._id===a.data.songs[d]._id}u.songList=b,u.setList={},u.setList.data={},u.setList.data._id=a.data._id,u.setList.data.date=a.data.date,u.setList.data.venue=a.data.venue,u.setList.data.songListID=a.data.songListID,u.setList.data.songs=[];for(var d=0;d<a.data.songs.length;d++){var e=$.grep(u.songList.data.songs,c);u.setList.data.songs.push(e[0])}u.loading=!1})}function m(){var a=e(u.songList.data.songs,u.search)[0];null==a&&(a={_id:f.getObjectId(),name:u.search},u.songList.data.songs.push(a),i.saveSongList(u.songList)),u.setList.data.songs.push(a),u.search=void 0,h.saveSetList(u.setList)}function n(a){u.setList.data.songs.push(u.songList.data.songs[a]),h.saveSetList(u.setList)}function o(){var a={};a.date=u.setList.data.date,a.venue=u.setList.data.venue;var c=b.open({templateUrl:"components/set-list-modal/set-list-modal.html",controller:"SetListModal",controllerAs:"vm",resolve:{setList:function(){return a}}});c.result.then(function(a){u.setList.data.date=a.date,u.setList.data.venue=a.venue,h.saveSetList(u.setList)},function(a){})}function p(a){var b=g(u.songList.data.songs,"name")[a],c=u.songList.data.songs.indexOf(b);u.songList.data.songs[c].edit=!0}function q(a,b){a!==b&&(u.setList.data.songs.splice(b,0,u.setList.data.songs.splice(a,1)[0]),h.saveSetList(u.setList))}function r(a,b){u.moveSong(u.setList.data.songs.indexOf(b),a)}function s(a){u.setList.data.songs.splice(a,1),h.saveSetList(u.setList)}function t(a){var b=g(u.songList.data.songs,"name")[a],c=u.songList.data.songs.indexOf(b);u.songList.data.songs[c].edit=!1,i.saveSongList(u.songList),h.saveSetList(u.setList)}var u=this;u.location=a.absUrl(),u.loading=!0,u.addNewSong=m,u.addSong=n,u.editSetList=o,u.editSong=p,u.moveSong=q,u.onDropComplete=r,u.removeSong=s,u.saveSong=t,k()}angular.module("SetListApp").controller("SetList",a),a.$inject=["$location","$uibModal","$scope","$stateParams","filterFilter","ObjectIdService","orderByFilter","SetListService","SongListService","SynchronisationService"]}(),function(){"use strict";function a(a,b,c){function d(){c.venue=f.venue,c.date=b(f.date).format(),a.close(c)}function e(){a.dismiss()}var f=this;f.venue=c.venue,c.date&&(f.date=b(c.date)._d),f.ok=d,f.cancel=e}angular.module("SetListApp").controller("SetListModal",a),a.$inject=["$uibModalInstance","$moment","setList"]}(),function(){"use strict";function a(a,b,c,d,e,f,g,h,i){function j(){b.$on("$destroy",function(){h.stopSetListsSynchroniser()}),g.getSetLists(k),h.startSetListsSynchroniser()}function k(a){o.setLists=a,o.loading=!1}function l(){function b(a){}var c=a.open({templateUrl:"components/set-list-modal/set-list-modal.html",controller:"SetListModal as vm",resolve:{setList:function(){return{}}}});c.result.then(n,b)}function m(a){var b=d(f(o.setLists.data,"date"));g.deleteSetList(b[a]._id),o.setLists.data.splice(o.setLists.data.indexOf(b[a]),1)}function n(a){var b={};b.data={},b.data._id=e.getObjectId(),b.data.venue=a.venue,b.data.date=a.date,o.setLists.data.push(b.data),g.saveSetLists(o.setLists),b.data.songListID=i.user().songListID,b.data.songs=[],g.saveSetList(b,!0),c.transitionTo("set-list",{setListID:b.data._id})}var o=this;o.loading=!0,o.setLists={data:[]},o.createSetList=l,o.deleteSetList=m,o.reallyCreateSetList=n,j()}angular.module("SetListApp").controller("SetLists",a),a.$inject=["$uibModal","$scope","$state","futureFilter","ObjectIdService","orderByFilter","SetListService","SynchronisationService","UserService"]}();