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
            },

            fetchDetails: function(api) {
                var deferred = $q.defer();
                $http.get(api).then(function(response) {
                    deferred.resolve(response.data);
                });
                return deferred.promise;
            }

        }
    })

    .filter('cdrDateFormat', function cdrDateFormat($filter) {
        return function(text){
            var tempdate = new Date(text)
            return $filter('date')(tempdate, 'dd-MM-yy HH:mm:ss');
        }

    })

    .filter('numberFromChannel', function numberFromChannel($filter) {
         return function(text){
            if(text.length <= 0){
                return text;
            }
            var endOfTypeBar = text.lastIndexOf('/');
            var startUniqueId = text.indexOf('-');
            if(endOfTypeBar > 0 && startUniqueId > 0){
               return text.substring(endOfTypeBar + 1, startUniqueId);

            }
            return text
        }
    });