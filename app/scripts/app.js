'use strict';
// Declare app level module which depends on filters, and services
angular.module('app', ['ui.directives', 'localization', 'ui.bootstrap', 'ui.bootstrap.collapse', 'plunker',
  'app.filters',
  'app.services',
  'app.directives',
  'services.breadcrumbs',
  'authentication',
  'services.i18nNotifications',
  'services.localizedMessages'
  ,'highcharts-ng'
])
  .config(['$routeProvider', '$httpProvider',
    function($routeProvider, $httpProvider) {
      //allow cross domain with angularjs
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      return $routeProvider
        .when('/', {
          template: '<div></div>',
          controller: 'AppCtrl',
          resolve: {
            //Invoque configurationService to load config.json file from server before initialize AppCtrl
            //AppCtrl initialise rootScope variable config
            configuration: (['configurationService',
              function(configurationService) {
                console.log("app routeProvider configuration for / route");
                return configurationService.promise;
              }
            ])
          }
        })
        .otherwise({
          redirectTo: '/dashboard'
        });

    }
  ])
  .config(['$locationProvider',
    function($locationProvider) {
      return $locationProvider.html5Mode(true); //.hashPrefix("#");
    }
  ])
  .run(function($rootScope, $location, currentUser) {
    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      if (currentUser.userInfo == null) {
        // no logged user or the page relaoded with F5 
        $location.path("/");

      }
    });
  });