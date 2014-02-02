'use strict';

angular.module('app')
  .service('dashboardService', function dashboardService() {
    // AngularJS will instantiate a singleton by calling "new" on this function
  })
  .factory('Poller', function($http, $timeout) {
  var data = { response: {}, calls: 0 };
  var poller = function() {
    $http.get('data.json').then(function(r) {
      data.response = r.data;
      data.calls++;
      $timeout(poller, 1000);
    });
    
  };
  poller();
  
  return {
    data: data
  };
});
