'use strict';

/**
 * Application based controllers
 * Each "core" part of the application has own controller
 *
 */

angular.module('app').controller('AppCtrl', ['$rootScope', '$scope', 'configurationService', 'currentUser', 'i18nNotifications', 
  'localizedMessages', 
  'networkNotificaitonService', 'localize', 'authentication', 'configuration',
  function($rootScope, $scope, configurationService, currentUser, i18nNotifications, localizedMessages,  
    networkNotificaitonService, localize, authentication, configuration) {
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
       

    $scope.removeNotification = function(notification) {
      i18nNotifications.remove(notification);
    };

    $rootScope.setWindowTitle = function(title) {
      $rootScope.windowTitle = "Avor : " + title;
    };

    $scope.$on('$routeChangeError', function(event, current, previous, rejection) {
      i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, {
        rejection: rejection
      });
    });

    $scope.$on('userLogon', function(event, data) {
      if (currentUser.isAuthenticated()) {
       
      }
    });

    $scope.$on('userLogout', function(event, data) {
      var data = {
        username: currentUser.userInfo.username,
        isAdmin: currentUser.isAdmin()
      };
     
      $scope.setWindowTitle("avoir: Please login");
    });

    
    //
    authentication.requestCurrentUser();   

    $scope.disconnecteSocket = function(currentUser) {
      
    };

    $scope.sendMessage = function(event, data) {
      
    }
  }
]);


angular.module('app').controller('HeaderCtrl', ['$scope', '$location', '$cookieStore', '$route', 'currentUser', 'breadcrumbs', 'notifications', 'localize',
  function($scope, $location, $cookieStore, $route, currentUser, breadcrumbs, notifications, localize) {
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
      } else {
        $location.path('/home');
        $scope.windowTitle = "Vor : home";
      }
    };

    $scope.$on('userLogon', function(event, data) {
      if (currentUser.isAuthenticated()) {
        $location.path('/dashboard');
      }
    });


    $scope.isNavbarActive = function(navBarPath) {
      return navBarPath === breadcrumbs.getFirst().name;

    };

    $scope.hasPendingRequests = function() {
      return false;
    };
  }
]);



angular.module('app').controller('ConfigCtrl', ['$scope', '$location',
  function($scope, $location) {
   
  }
]);
 
