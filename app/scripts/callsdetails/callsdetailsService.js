'use strict';

angular.module('app')
 .factory('cdrService', function($http, $q) {
  return {
    fetch: function(api) {
      var deferred = $q.defer();
      $http.get(api).then(function(response) {
        deferred.resolve(response.data);
      });
      return deferred.promise;
    }

  }
});