'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('app.services', []);

services.value('version', '1.0.2');

services.factory('networkNotificaitonService', ['$rootScope',
  function($rootScope) {
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
  }
]);

/**
 * Configuration service fetch config file from server.
 * The configuration contains information about the server host and port.
 */
services.factory('configurationService', ['$http',
  function($http) {
    var myData = null;
    var promise = $http.get('config.json').success(function(data) {
      console.debug("configurationService got data " + JSON.stringify(data));
      myData = data;
    });

    return {
      promise: promise,

      setData: function(data) {
        myData = data;
      },

      getData: function(){
        return myData
      },

      doStuff: function() {
        return myData;
      },

      isChartExportEnabled : function(){
        if(myData == null || myData.chartExport == null){
          return false
        }
        //
        if(myData.chartExport.indexOf("true") > -1 ){
          return true
        }
        return false
      }
    };
  }
]);

/**
 * 
 *
 */
services.factory('appDataService', ['$rootScope', '$http', '$q',
  function($rootScope, $http, $q) {
    return {
      fetchEndPoints: function(endpoints) {
        var api = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/' + endpoints;
        var deferred = $q.defer();
        $http.get(api).then(function(response) {
          deferred.resolve(response.data);
        });
        return deferred.promise;
      },
      fetchDids: function() {
        var api = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/dids';
        var deferred = $q.defer();
        $http.get(api).then(function(response) {
          deferred.resolve(response.data);
        });
        return deferred.promise;
      },
      fetchPeers: function(api) {
        var api = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/peers';
        var deferred = $q.defer();
        $http.get(api).then(function(response) {
          deferred.resolve(response.data);
        });
        return deferred.promise;
      }
    };
  }
]);

/**
 * 
 *
 */
services.factory('toolsService', ['$rootScope', 'localize',
  function($rootScope, localize) {
     $rootScope.format = function(num)
            {
                var val='0'
                if (num > 0){
                    if (num >= 10)
                        val = num;
                    else
                        val = '0' + num;
                    }
                    else
                        val = '00';
                        return val;
            }

    return {
      secondsToHMS: function(d) {
         d = Number(d);
         var h = Math.floor(d / 3600);
         var m = Math.floor(d % 3600 / 60);
         var s = Math.floor(d % 3600 % 60);
         var hr = $rootScope.format(h);
         var min = $rootScope.format(m);
         var sec = $rootScope.format(s);
         var val = hr + ':' + min + ':' + sec;
         return val;       
      },

      format: function(num) {
        var val='0'
        if (num > 0){
              if (num >= 10)
                  val = num;
              else
                        val = '0' + num;
        }
        else
          val = '00';
          return val;
      },

      getLabelForHangupCause: function (causeNumber) {
        if (causeNumber == 16) {
          return localize.getLocalizedString("_cdrs.search.cause.option.answer_");
        }else if (causeNumber == 17) {
          return localize.getLocalizedString("_cdrs.search.cause.option.busy_");
        }else if (causeNumber == 19) {
          return localize.getLocalizedString("_cdrs.search.cause.option.non_answer_");
        }else if (causeNumber == 21) {
          return localize.getLocalizedString("_cdrs.search.cause.option.cancel_");
        }else if (causeNumber == 34) {
          return localize.getLocalizedString("_cdrs.search.cause.option.congestion_");
        }else if (causeNumber == 41) {
          return localize.getLocalizedString("_cdrs.search.cause.option.failed_");
        }else if (causeNumber == 47) {
          return localize.getLocalizedString("_cdrs.search.cause.option.chanunaval_");
        }else {
            return causeNumber;
        }
      },

      getDataTableLangUrl: function (){
        var langUrl = "i18n/datatable_en-US.json";
        if (localize.language == "fr-FR") {
          langUrl = "i18n/datatable_fr-FR.json"
        }
        return langUrl
      }
     
    };
  }
]);