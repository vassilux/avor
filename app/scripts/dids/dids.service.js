angular.module('dids.services',[])

.factory('didsCrudService', ['$rootScope', '$http', 'currentUser', function($rootScope, $http, currentUser) {
  console.log("Create didsCrudService");
  var didsCrudService = {};

  didsCrudService.getDids = function(callback) {
    var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/dids";
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

  didsCrudService.deleteDid = function(did, callback) {
    var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/deletedid/";
  	console.log(" didsCrudService.deleteDid " + did.id);
     $http({
      method: 'GET',
      url: url + did._id
    }).
    success(function(data, status, headers, config) {
      callback(status)
    }).
    error(function(data, status, headers, config) {
    	console.log(" didsCrudService.deleteDid " + did._id + " error");
      callback(status);
    });
  };

  didsCrudService.addDid = function(did, callback) {
  	console.log(" didsCrudService.addUser " + JSON.stringify(user));
    var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/createdid";
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

  didsCrudService.updateDid = function(did, callback) {
    var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/updatedid";
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


  return didsCrudService;

}]);