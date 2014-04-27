'use strict';

angular.module('app')
  .factory('sse', function($rootScope) {
    if (typeof(EventSource) !== "undefined") {
      console.log("EventSource supported.");
      var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/config.json';
      var sse = new EventSource(url);
      return {
        addEventListener: function(eventName, callback) {
          try {
            sse.addEventListener(eventName, function() {
              var args = arguments;
              $rootScope.$apply(function() {
                callback.apply(sse, args);
              });
            });
          } catch (e) {
            console.log(e)
          }

        }
      };
    } else {
      console.log("Sorry! No server-sent events support.");
      // 
    }
  })
  .service('dashboardService', function dashboardService() {
    // AngularJS will instantiate a singleton by calling "new" on this function
  })
.factory('Poller', function($http, $q) {
  return {
    poll: function(api) {
      var deferred = $q.defer();
      $http.get(api).then(function(response) {
        deferred.resolve(response.data);
      });
      return deferred.promise;
    }

  }
});