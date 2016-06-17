!function(){"use strict";function a(a,b,c,d,e,f,g,h){h.init({accessToken:g,verbose:"development"===e,captureUncaught:!0,payload:{environment:e}}),"development"===e&&a.developerMode(!0),c.state("login",{url:"/login",templateUrl:"components/login/login.html",controller:"Login",controllerAs:"vm",secure:!1}).state("authorize",{url:"/authorize",templateUrl:"components/authorize/authorize.html",controller:"Authorize",controllerAs:"vm",secure:!1}).state("release-notes",{url:"/release-notes",templateUrl:"components/release-notes/release-notes.html",secure:!1}).state("set-lists",{url:"/set-lists",templateUrl:"components/set-lists/set-lists.html",controller:"SetLists",controllerAs:"vm",secure:!0}).state("set-list",{url:"/set-lists/:setListID",templateUrl:"components/set-list/set-list.html",controller:"SetList",controllerAs:"vm",secure:!0}).state("share",{url:"/share/:shareID",templateUrl:"components/share/share.html",controller:"Share",controllerAs:"vm",secure:!1}),d.otherwise("/set-lists"),b.init({appId:f,status:!0,cookies:!1,xfbml:!1,version:"v2.6"})}function b(a,b,c,d,e,f,g){var h=g.user();h&&f.configure({payload:{person:{id:h.id}}}),a.setUsername(h.id),c.$on("$stateChangeStart",function(a,b,c,f,g){e.location.search?-1!==e.location.search.indexOf("?code=")?e.location.href=e.location.origin+e.location.pathname+"#/authorize":e.location.href=e.location.origin+e.location.pathname+"#/set-lists":b.secure&&!h.isLoggedIn&&(d.transitionTo("login"),a.preventDefault())}),c.$on("authenticate",function(b,c){c.authenticated?(h=g.user(),f.configure({payload:{person:{id:h.id}}}),a.setUsername(h.id),d.transitionTo("set-lists")):d.transitionTo("login")}),c.$on("authorize",function(a,b){g.logout()})}a.$inject=["$analyticsProvider","$facebookProvider","$stateProvider","$urlRouterProvider","ENV","FB_APPID","ROLLBAR_ID","RollbarProvider"],b.$inject=["$analytics","$facebook","$rootScope","$state","$window","Rollbar","UserService"],angular.module("SetListApp",["angular-momentjs","angulartics","angulartics.google.analytics","bm.uiTour","facebook","ngclipboard","ngDraggable","ngResource","SetListApp.config","tandibar/ng-rollbar","ui.bootstrap","ui.bootstrap.datetimepicker","ui.router"]).constant("VERSION","0.28").constant("PATCH","0").config(a).run(b)}(),function(){"use strict";function a(a){return function(b){var c=[];return angular.forEach(b,function(b){a(b.date).isSameOrAfter(a(),"day")&&c.push(b)}),c}}angular.module("SetListApp").filter("future",a),a.$inject=["$moment"]}(),function(){"use strict";function a(a){return function(b){var c=[];return angular.forEach(b,function(b){a(b.date).isBefore(a(),"day")&&c.push(b)}),c}}angular.module("SetListApp").filter("past",a),a.$inject=["$moment"]}(),function(){"use strict";function a(a,b){return a(b+"/authorizations/:accessToken")}angular.module("SetListApp").factory("AuthorizationResource",a),a.$inject=["$resource","API"]}(),function(){"use strict";function a(){function a(){if("undefined"!=typeof localStorage){var a=parseInt(localStorage.mongoMachineId);a>=0&&16777215>=a&&(e=Math.floor(localStorage.mongoMachineId)),localStorage.mongoMachineId=e}}function b(){var a=Math.floor((new Date).valueOf()/1e3);c++,c>16777215&&(c=0);var b=a.toString(16),f=e.toString(16),g=d.toString(16),h=c.toString(16);return"00000000".substr(0,8-b.length)+b+"000000".substr(0,6-f.length)+f+"0000".substr(0,4-g.length)+g+"000000".substr(0,6-h.length)+h}var c=0,d=Math.floor(32767*Math.random()),e=Math.floor(16777216*Math.random()),f={getObjectId:b};return a(),f}angular.module("SetListApp").service("ObjectIdService",a)}(),function(){"use strict";function a(a,b){return a(b+"/set-lists/:setListID",{},{update:{method:"PUT"}})}angular.module("SetListApp").factory("SetListResource",a),a.$inject=["$resource","API"]}(),function(){"use strict";function a(a,b){return a(b+"/shares/:shareID")}angular.module("SetListApp").factory("ShareResource",a),a.$inject=["$resource","API"]}(),function(){"use strict";function a(a,b){return a(b+"/song-lists/:songListID",{},{update:{method:"PUT"}})}angular.module("SetListApp").factory("SongListResource",a),a.$inject=["$resource","API"]}(),function(){"use strict";function a(a,b,c,d){function e(){var b=angular.fromJson(localStorage.authorization);return b?(a.defaults.headers.common["auth-token"]=b.authToken,{isLoggedIn:!0,id:b._id,name:b.firstName+" "+b.lastName,band:b.band,songListID:b.songListID,toured:b.toured||[]}):{isLoggedIn:!1,id:void 0,name:void 0,band:void 0,songListID:void 0,toured:[]}}function f(a){c.get({accessToken:a.accessToken},function(a){localStorage.authorization=angular.toJson(a),b.$broadcast("authenticate",{authenticated:!0})},function(a){d.warning("login failed to get the authorization from the server",a)})}function g(){var c=angular.fromJson(localStorage.authorization);c&&localStorage.removeItem("authorization"),delete a.defaults.headers.common["auth-token"],b.$broadcast("authenticate",{authenticated:!1})}function h(a){var c=angular.fromJson(localStorage.authorization);void 0===c?b.$broadcast("authorize",{authorized:!1}):(void 0===c.toured&&(c.toured=[]),c.toured.indexOf(a)<0&&(c.toured.push(a),localStorage.authorization=angular.toJson(c)))}return{user:e,login:f,logout:g,finishTour:h}}angular.module("SetListApp").service("UserService",a),a.$inject=["$http","$rootScope","AuthorizationResource","Rollbar"]}(),function(){"use strict";function a(a,b,c,d){function e(){console.log("Set list synchroniser started"),i=a(function(){if(d.setListID){var a=angular.fromJson(localStorage["setList_"+d.setListID]);if(void 0!==a){var e=angular.fromJson(localStorage["songList_"+angular.fromJson(localStorage["setList_"+d.setListID]).data.songListID]);void 0!==e&&e.isDirty&&b.saveSongListToServer(e),a.isDirty&&c.saveSetListToServer(a)}}},2e3)}function f(){console.log("Set list synchroniser stopped"),a.cancel(i)}function g(){console.log("Set lists synchroniser started"),i=a(function(){var a=angular.fromJson(localStorage.dirtyLaundry);if(void 0!==a)for(var b=0;b<a.length;b++)c.deleteSetListFromServer(a[b])},2e3)}function h(){console.log("Set lists synchroniser stopped"),a.cancel(i)}var i;return{startSetListSynchroniser:e,stopSetListSynchroniser:f,startSetListsSynchroniser:g,stopSetListsSynchroniser:h}}angular.module("SetListApp").service("SynchronisationService",a),a.$inject=["$interval","SongListService","SetListService","$stateParams"]}(),function(){"use strict";function a(a,b,c){function d(d){console.log("Get set lists from the server"),c.query({},function(a){var b={};b.data=a,d(b),e(b,!1)},function(c){if(401===c.status)a.$broadcast("authorize",{authorized:!1});else{var e=angular.fromJson(localStorage.setLists);void 0===e&&(e={},e.data=[]),d(e),b.warning("getSetLists failed to get set lists -- set lists gotten from localStorage",c)}})}function e(a){localStorage.setLists=angular.toJson(a)}function f(d,e){console.log("Get set list from the server"),c.get({setListID:d},function(a){var b={};b.data=a,e(b),g(b,!1)},function(c){if(401===c.status)a.$broadcast("authorize",{authorized:!1});else{var f=angular.fromJson(localStorage["setList_"+d]);void 0===f&&(f={},f.data=[]),e(f),b.warning("getSetList failed to get set list -- set lists gotten from localStorage",c)}})}function g(a,b){console.log("Save set list to localStorage"),void 0===b&&(b=!0),a.isDirty=b,localStorage["setList_"+a.data._id]=angular.toJson(a)}function h(d){console.log("Save set list to server!"),c.update({setListID:d.data._id},d.data,function(a){g(d,!1)},function(c){401===c.status?a.$broadcast("authorize",{authorized:!1}):b.warning("saveSetListToServer failed to save the set list to the server",c)})}function i(a){console.log("Save set list to dirty laundry list in local storage");var b=angular.fromJson(localStorage.dirtyLaundry);void 0===b&&(b=[]),b.push(a),localStorage.dirtyLaundry=angular.toJson(b)}function j(d){console.log("Delete set list from server"),c["delete"]({setListID:d},function(a){var b=angular.fromJson(localStorage.dirtyLaundry);b.splice(b.indexOf(d),1),localStorage.dirtyLaundry=angular.toJson(b)},function(c){401===c.status?a.$broadcast("authorize",{authorized:!1}):b.warning("deleteSetListFromServer failed to delete the set list from the server",c)})}return{getSetLists:d,saveSetLists:e,getSetList:f,saveSetList:g,saveSetListToServer:h,deleteSetList:i,deleteSetListFromServer:j}}angular.module("SetListApp").service("SetListService",a),a.$inject=["$rootScope","Rollbar","SetListResource"]}(),function(){"use strict";function a(a,b,c){function d(a,d){console.log("Get set list from the server"),c.get({shareID:a},function(a){var b={};b.data=a,d(b)},function(a){d(void 0),b.warning("getShare failed to get set list",a)})}return{getShare:d}}angular.module("SetListApp").service("ShareService",a),a.$inject=["$rootScope","Rollbar","ShareResource"]}(),function(){"use strict";function a(a,b,c){function d(d,f){console.log("Get song list from the server"),c.get({songListID:d},function(a){var b={};b.data=a,f(b),e(b,!1)},function(c){if(401===c.status)a.$broadcast("authorize",{authorized:!1});else{var e=angular.fromJson(localStorage["songList_"+d]);void 0===e&&(e={},e.data=[]),f(e),b.warning("getSongList failed to get the song list -- song list gotten from localStorage")}})}function e(a,b){console.log("Save song list to local storage"),void 0===b&&(b=!0),a.isDirty=b,localStorage["songList_"+a.data._id]=angular.toJson(a)}function f(d){console.log("Save song list to server!"),c.update({songListID:d.data._id},d.data,function(a){e(d,!1)},function(c){401===c.status?a.$broadcast("authorize",{authorized:!1}):b.warning("saveSongListToServer failed to save the song list to the server",c)})}return{getSongList:d,saveSongList:e,saveSongListToServer:f}}angular.module("SetListApp").service("SongListService",a),a.$inject=["$rootScope","Rollbar","SongListResource"]}(),function(){"use strict";function a(a,b,c,d,e){function f(){e.info("New user authorized"),a.getLoginStatus().then(function(a){"connected"===a.status?d.login(a.authResponse):d.logout()},function(a){e.warning("$facebook.getLoginStatus failed to return a response",a),b.transitionTo("login")})}f()}angular.module("SetListApp").controller("Authorize",a),a.$inject=["$facebook","$state","FB_APPID","UserService","Rollbar"]}(),function(){"use strict";function a(a,b,c,d,e){function f(){d.logout(function(){})}function g(){var a=c.getTour();a&&a.start()}function h(){d.finishTour(a.current.name)}var i=this;i.finishTour=h,i.logout=f,i.startTour=g,i.version=e}angular.module("SetListApp").controller("Index",a),a.$inject=["$state","Rollbar","uiTourService","UserService","VERSION"]}(),function(){"use strict";function a(a,b,c,d,e){function f(){g.loading=!0,a.getLoginStatus().then(function(a){"connected"===a.status?e.login(a.authResponse):b.location.href="https://www.facebook.com/dialog/oauth?client_id="+c+"&scope=public_profile,email&redirect_uri="+b.location.origin+b.location.pathname},function(a){d.warning("$facebook.getLoginStatus failed to return a response",a),g.loading=!1})}var g=this;g.loading=!1,g.login=f}angular.module("SetListApp").controller("Login",a),a.$inject=["$facebook","$window","FB_APPID","Rollbar","UserService"]}(),function(){"use strict";function a(a,b,c,d,e,f,g,h,i,j,k,l){function m(){if(h.getSetList(d.setListID,n),j.startSetListSynchroniser(),c.$on("$destroy",function(){j.stopSetListSynchroniser()}),l.user().toured.indexOf("set-list")<0){var a=k.getTour();a&&a.start()}}function n(a){i.getSongList(a.data.songListID,function(b){function c(b){return b._id===a.data.songs[d]._id}x.songList=b,x.setList={},x.setList.data={},x.setList.data._id=a.data._id,x.setList.data.date=a.data.date,x.setList.data.venue=a.data.venue,x.setList.data.share=a.data.share,x.setList.data.songListID=a.data.songListID,x.setList.data.songs=[];for(var d=0;d<a.data.songs.length;d++){var e=$.grep(x.songList.data.songs,c);x.setList.data.songs.push(e[0])}x.loading=!1})}function o(){var a=e(x.songList.data.songs,x.search)[0];null==a&&(a={_id:f.getObjectId(),name:x.search},x.songList.data.songs.push(a),i.saveSongList(x.songList)),x.setList.data.songs.push(a),x.search=void 0,h.saveSetList(x.setList)}function p(a){x.setList.data.songs.push(g(x.songList.data.songs,"name")[a]),h.saveSetList(x.setList)}function q(){var a={};a.date=x.setList.data.date,a.venue=x.setList.data.venue;var c=b.open({templateUrl:"components/set-list-modal/set-list-modal.html",controller:"SetListModal",controllerAs:"vm",resolve:{setList:function(){return a}}});c.result.then(function(a){x.setList.data.date=a.date,x.setList.data.venue=a.venue,h.saveSetList(x.setList)},function(a){})}function r(a){var b=g(x.songList.data.songs,"name")[a],c=x.songList.data.songs.indexOf(b);x.songList.data.songs[c].edit=!0}function s(a,b){a!==b&&(x.setList.data.songs.splice(b,0,x.setList.data.songs.splice(a,1)[0]),h.saveSetList(x.setList))}function t(b,c){x.moveSong(x.setList.data.songs.indexOf(c),b),a.eventTrack("Drag and drop song")}function u(a){x.setList.data.songs.splice(a,1),h.saveSetList(x.setList)}function v(a){var b=g(x.songList.data.songs,"name")[a],c=x.songList.data.songs.indexOf(b);x.songList.data.songs[c].edit=!1,i.saveSongList(x.songList),h.saveSetList(x.setList)}function w(){x.setList.data.share||(x.setList.data.share=f.getObjectId(),h.saveSetList(x.setList));b.open({templateUrl:"components/share-modal/share-modal.html",controller:"ShareModal",controllerAs:"vm",resolve:{share:function(){return x.setList.data.share}}})}var x=this;x.loading=!0,x.addNewSong=o,x.addSong=p,x.editSetList=q,x.editSong=r,x.moveSong=s,x.onDropComplete=t,x.removeSong=u,x.saveSong=v,x.shareSetList=w,m()}angular.module("SetListApp").controller("SetList",a),a.$inject=["$analytics","$uibModal","$scope","$stateParams","filterFilter","ObjectIdService","orderByFilter","SetListService","SongListService","SynchronisationService","uiTourService","UserService"]}(),function(){"use strict";function a(a,b,c){function d(){c.venue=f.venue,c.date=b(f.date).format(),a.close(c)}function e(){a.dismiss()}var f=this;f.venue=c.venue,c.date&&(f.date=b(c.date)._d),f.ok=d,f.cancel=e}angular.module("SetListApp").controller("SetListModal",a),a.$inject=["$uibModalInstance","$moment","setList"]}(),function(){"use strict";function a(a,b,c,d,e,f,g,h,i,j){function k(){if(b.$on("$destroy",function(){h.stopSetListsSynchroniser()}),g.getSetLists(l),h.startSetListsSynchroniser(),j.user().toured.indexOf("set-lists")<0){var a=i.getTour();a&&a.start()}}function l(a){p.setLists=a,p.loading=!1}function m(){function b(a){}var c=a.open({templateUrl:"components/set-list-modal/set-list-modal.html",controller:"SetListModal as vm",resolve:{setList:function(){return{}}}});c.result.then(o,b)}function n(a){var b=d(f(p.setLists.data,"date"));g.deleteSetList(b[a]._id),p.setLists.data.splice(p.setLists.data.indexOf(b[a]),1)}function o(a){var b={};b.data={},b.data._id=e.getObjectId(),b.data.venue=a.venue,b.data.date=a.date,p.setLists.data.push(b.data),g.saveSetLists(p.setLists),b.data.songListID=j.user().songListID,b.data.songs=[],g.saveSetList(b,!0),c.transitionTo("set-list",{setListID:b.data._id})}var p=this;p.loading=!0,p.setLists={data:[]},p.createSetList=m,p.deleteSetList=n,p.reallyCreateSetList=o,k()}angular.module("SetListApp").controller("SetLists",a),a.$inject=["$uibModal","$scope","$state","futureFilter","ObjectIdService","orderByFilter","SetListService","SynchronisationService","uiTourService","UserService"]}(),function(){"use strict";function a(a,b){function c(){b.getShare(a.shareID,d)}function d(a){e.setList=a,e.loading=!1}var e=this;e.loading=!0,c()}angular.module("SetListApp").controller("Share",a),a.$inject=["$stateParams","ShareService"]}(),function(){"use strict";function a(a,b,c){function d(){a.close()}var e=this;e.shareUrl=b+"/share/"+c,e.ok=d}angular.module("SetListApp").controller("ShareModal",a),a.$inject=["$uibModalInstance","BASE_URL","share"]}();