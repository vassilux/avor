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

            $scope.titleInCallsDisposition = localize.getLocalizedString("_chart.common.peer.disposition.in.title_");
            $scope.titleOutCallsDisposition = localize.getLocalizedString("_chart.common.peer.disposition.out.title_");
            //
            $scope.dailyDate = new Date();

            //callbacks for the direectives controllers
            $scope.setInCallsDirectiveFn = function(directiveFn) {
                $scope.directiveInCallsFn = directiveFn
            }

            $scope.setOutCallsDirectiveFn = function(directiveFn) {
                $scope.directiveOutCallsFn = directiveFn
            }

            $scope.setDidCallsDirectiveFn = function(directiveFn) {
                $scope.directiveDidCallsFn = directiveFn
            }

            $scope.setInCallsDispositionDirectiveFn = function(directiveFn){
                $scope.directiveInCallsDispositionFn = directiveFn
            }

            $scope.setOutCallsDispositionDirectiveFn = function(directiveFn){
                $scope.directiveOutCallsDispositionFn = directiveFn
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

            function processPeerIncommingDispositionData(data) {
                $scope.directiveInCallsDispositionFn(data)
            };

             function processPeerOutcommingDispositionData(data) {
                $scope.directiveOutCallsDispositionFn(data)
            };

            var Repeater = function() {
                $scope.dailyDate = new Date();
                $scope.myts = Poller.poll(url);
                $scope.pollData = $scope.myts.then(function(response) {
                    var jsonData = JSON.parse(response.data)
                    processDidData(jsonData.didCalls);
                    processPeerIncommingData(jsonData.peerInCalls);
                    processPeerOutgoingData(jsonData.peerOutCalls);
                    var d = []
                    processPeerIncommingDispositionData(jsonData.peerInCallsDisp)
                    processPeerOutcommingDispositionData(jsonData.peerOutCallsDisp)
                    return response.data;
                });
            };

            Repeater()

            $scope.poller = $interval(Repeater, 10000);
            //polling stop when leave controller scope
            $scope.$on('$destroy', function() {

                $interval.cancel($scope.poller);
            });

        }
    ]);