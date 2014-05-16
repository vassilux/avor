'use strict';

angular.module('app')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/daily', {
                templateUrl: 'scripts/daily/daily.tpl.html',
                controller: 'DailyCtrl'

            });
        }
    ])
    .controller('DailyCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
        //
        $scope.choiseDid = "";
        $scope.dailyDate = new Date();
        $scope.searchShow = true;
        $scope.searchShowError = false;
        

    }
    ]);