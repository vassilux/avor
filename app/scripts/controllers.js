//'use strict';

/**
 * Application based controllers
 * Each "core" part of the application has own controller
 *
 */

angular.module('app').controller('AppCtrl', ['$rootScope', '$cookieStore', '$scope', 'configurationService', 'currentUser', 'i18nNotifications', 
  'localizedMessages', 
  'networkNotificaitonService', 'localize', 'authentication', 'configuration',
  function($rootScope, $cookieStore, $scope, configurationService, currentUser, i18nNotifications, localizedMessages,  
    networkNotificaitonService, localize, authentication, configuration) {
    console.log("create AppCtrl");
    var config = configurationService.doStuff();
    if (config != null) {
      console.log("start AppCtrl and get data : " + JSON.stringify(config.host));
    } else {
      console.log("start AppCtrl and get data is null am back");
      return;
    }
    //offer the configuration to others parts
    $rootScope.config = config;
    $scope.notifications = i18nNotifications;
  
    localize.setLanguage('fr-FR');
     

    $scope.removeNotification = function(notification) {
      i18nNotifications.remove(notification);
    };

    $rootScope.setWindowTitle = function(title) {
      $rootScope.windowTitle = "AVor : " + title;
       $rootScope.loadingView = true;
    };

    $scope.$on('$routeChangeError', function(event, current, previous, rejection) {
      i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, {
        rejection: rejection
      });
    });

    $scope.$on('userLogon', function(event, data) {
      console.log("userLogon event : " + currentUser.isAuthenticated())
      if (currentUser.isAuthenticated()) {
        
       
      }
    });

    $scope.$on('userLogout', function(event, data) {
      $cookieStore.remove('avoruser')
           
      $scope.setWindowTitle("AVor : Please login");
    });

    
    //
    authentication.requestCurrentUser();   

    $scope.disconnecteSocket = function(currentUser) {
      
    };

    $scope.sendMessage = function(event, data) {
      
    }


  }
])
.controller('HeaderCtrl', ['$rootScope' ,'$scope', '$location', '$route', 'currentUser', 'notifications', 'localize',
  function($rootScope, $scope, $location, $route, currentUser, notifications, localize) {
    $rootScope.loadingView = true;
    $scope.location = $location;
    $scope.currentUser = currentUser;

    $scope.setEnglishLanguage = function() {
      localize.setLanguage('en-US');
    };

    $scope.setFrenchLanguage = function() {
      localize.setLanguage('fr-FR');
    };

    $scope.home = function() {
      if ($scope.currentUser.isAuthenticated()) {
        $location.path('/dashboard');
        $scope.windowTitle = "AVor : home";
      } else {
        $location.path('/');
        $scope.windowTitle = "AVor : home";
      }
    };

    $scope.$on('userLogon', function(event, data) {
      if (currentUser.isAuthenticated()) {
        $location.path('/dashboard');
      }
    });

    $scope.$on('userLogout', function(event, data) {
      if (currentUser.isAuthenticated()) {
        $location.path('/');
      }
    });


    $scope.isNavbarActive = function(navBarPath) {
      return navBarPath === breadcrumbs.getFirst().name;

    };

    $scope.hasPendingRequests = function() {
      return false;
    };
  }
])
.controller('ConfigCtrl', ['$scope', '$location',
  function($scope, $location) {
   
  }
]);