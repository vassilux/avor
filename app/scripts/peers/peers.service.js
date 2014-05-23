angular.module('peers.services',[])

.factory('peersCrudService', ['$rootScope', '$http', 'currentUser', function($rootScope, $http, currentUser) {
  var peersCrudService = {};

  peersCrudService.getPeers = function(callback) {
    var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/peers";
     $http({
      method: 'GET',
      url: url
    }).
    success(function(data, status, headers, config) {
      callback(status, data)
    }).
    error(function(data, status, headers, config) {
      callback(status, data);
    });
  };

  peersCrudService.deletePeer = function(did, callback) {
    var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/deletepeer/";
     $http({
      method: 'GET',
      url: url + did.id
    }).
    success(function(data, status, headers, config) {
      console.log(" peersCrudService.deletePeer : " + status)
      callback(status)
    }).
    error(function(data, status, headers, config) {
      callback(status);
    });
  };

  peersCrudService.addPeer = function(did, callback) {
    var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/createpeer";
  	var xsrf = $.param({id: did.id, value: did.value, comment: did.comment});
     $http({
      method: 'POST',
      url: url,
      data: xsrf,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).
    success(function(data, status, headers, config) {
      callback(status)
    }).
    error(function(data, status, headers, config) {
      callback(status);
    });
  };

  peersCrudService.updatePeer = function(did, callback) {
    var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/updatepeer";
    var xsrf = $.param({id: did.id, value: did.value, comment:did.comment});
     $http({
      method: 'POST',
      url: url,
      data: xsrf,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).
    success(function(data, status, headers, config) {
      callback(status)
    }).
    error(function(data, status, headers, config) {
      callback(status);
    });
  };


  return peersCrudService;

}]);