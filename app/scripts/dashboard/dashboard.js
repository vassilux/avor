'use strict';

angular.module('app')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/dashboard', {
                templateUrl: 'scripts/dashboard/dashboard.tpl.html',
                controller: 'DashboardCtrl'

            });
        }
    ])
    .controller('DashboardCtrl', ['$rootScope', '$scope', '$timeout', '$interval', 'localize', 'Poller',
        function($rootScope, $scope, $timeout, $interval, localize, Poller) {
            //
            $scope.titleDIDCalls =  localize.getLocalizedString("_chart.common.sda.title_");
            $scope.titleInCalls = localize.getLocalizedString("_chart.common.peer.in.title_");
            $scope.titleOutCalls = localize.getLocalizedString("_chart.common.peer.out.title_");
            //
            $scope.dailyDate = new Date();

            //callbacks for the direectives controllers
            $scope.setInCallsDirectiveFn = function(directiveFn) {
                $scope.directiveInCallsFn = directiveFn
            }

            $scope.setOutCallsDirectiveFn = function(directiveFn) {
                $scope.directiveOutCallsFn = directiveFn
            }

            $scope.setDidtCallsDirectiveFn = function(directiveFn) {
                $scope.directiveDidCallsFn = directiveFn
            }


            //Just to start
            var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/poll';
            $scope.myts = Poller.poll(url);
            $scope.pollData = $scope.myts.then(function(response) {
                var jsonData = JSON.parse(response.data);
                processDidData(jsonData.didCalls);
                processPeerIncommingData(jsonData.peerInCalls);
                processPeerOutgoingData(jsonData.peerOutCalls);
                //
                return response.data;
            });

            function processDidData(didCalls) {
                $scope.directiveDidCallsFn(didCalls);
            };

            function processPeerIncommingData(peerInCalls) {
                $scope.directiveInCallsFn(peerInCalls);
            };

            function processPeerOutgoingData(peerOutCalls) {
                $scope.directiveOutCallsFn(peerOutCalls);
            };

            var Repeater = function() {
                $scope.dailyDate = new Date();
                $scope.myts = Poller.poll(url);
                $scope.pollData = $scope.myts.then(function(response) {
                    var jsonData = JSON.parse(response.data)
                    processDidData(jsonData.didCalls);
                    processPeerIncommingData(jsonData.peerInCalls);
                    processPeerOutgoingData(jsonData.peerOutCalls);
                    return response.data;
                });
            };
            $scope.poller = $interval(Repeater, 5000);
            //polling stop when leave controller scope
            $scope.$on('$destroy', function() {

                $interval.cancel($scope.poller);
            });

        }
    ]);