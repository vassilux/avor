'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('app.services', []);

services.value('version', '0.0.1');

services.factory('networkNotificaitonService', ['$rootScope', function($rootScope) {
    var networkNotificaitonService = {};
    
    networkNotificaitonService.message = '';

    networkNotificaitonService.prepForBroadcast = function(msg) {
        this.message = msg;
        this.broadcastItem();
    };

    networkNotificaitonService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };

    return networkNotificaitonService;
}]);

/**
 * Configuration service fetch config file from server.
 * The configuration contains information about the server host and port.
 */
services.factory('configurationService', ['$http', function($http) {
    var myData = null;
    var promise = $http.get('config.json').success(function(data){
        console.debug("configurationService got data " + JSON.stringify(data));
        myData = data;
    });

    return {
      promise:promise,

      setData : function(data){
        myData = data;
      },

      doStuff: function() {
        return myData;
      }
    };
}]);



