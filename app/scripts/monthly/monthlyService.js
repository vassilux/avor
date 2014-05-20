'use strict';

angular.module('app')
  .factory('monthlyService', function($http, $q) {
     return {
            fetchDidDatas: function(api) {
                var deferred = $q.defer();
                $http.get(api).then(function(response) {
                    deferred.resolve(response.data);
                });
                return deferred.promise;
            },

            fetchPeerDatas: function(api) {
                var deferred = $q.defer();
                $http.get(api).then(function(response) {
                    deferred.resolve(response.data);
                });
                return deferred.promise;
            }

        }
  });
 