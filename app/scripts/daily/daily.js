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
    .controller('DailyCtrl', ['$rootScope', '$scope', '$filter', 'localize', 'dailyService',
        function($rootScope, $scope, $filter, localize, dailyService) {
            //set urls targes please check the backoffice routes configuration
            $scope.didsTarget = "dids"
            $scope.peersTarget = "peers"
            //
            $scope.titleDIDCalls = localize.getLocalizedString("_chart.common.sda.title_");
            $scope.titleInCalls = localize.getLocalizedString("_chart.common.peer.in.title_");
            $scope.titleOutCalls = localize.getLocalizedString("_chart.common.peer.out.title_");
            $scope.titleDIDCallsByHours = localize.getLocalizedString("_chart.common.sda.hour.title_");

            //
            $scope.choiseDid = {};
            $scope.choisePeer = {};
            //
            $scope.dailyDidDate = new Date();
            $scope.dailyPeerDate = new Date();
            $scope.searchShow = true;
            $scope.searchShowError = false;
            //
            $scope.fetchDidDatas = function() {
                var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/daily/didincomming/';
                var didDate = $filter('date')($scope.dailyDidDate, 'yyyy-MM-dd');
                url += didDate + 'T23:59:59Z';
                if ($scope.choiseDid.value != "") {
                    url += "/" + $scope.choiseDid.value
                }
                $scope.myts = dailyService.fetchDidDatas(url);
                $scope.didDatas = $scope.myts.then(function(response) {
                    $scope.directiveDidCallsFn(response);
                    return response;
                });
                $scope.fetchDidCallsByHoursDatas();
            }
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

            $scope.setDidCallsByHourDirectiveFn = function(directiveFn) {
                $scope.directiveDidCallsByHourFn = directiveFn
            }
            // 
            $scope.fetchPeerDatas = function() {
                var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/daily/peerdatas/';
                var peerDate = $filter('date')($scope.dailyPeerDate, 'yyyy-MM-dd');
                url += peerDate + 'T23:59:59Z';
                if ($scope.choisePeer.value != "") {
                    url += "/" + $scope.choisePeer.value;
                }
                $scope.myts = dailyService.fetchPeerDatas(url);
                /* */
                $scope.peersDatas = $scope.myts.then(function(response) {
                    //console.log("response : " + JSON.stringify(response));
                    $scope.directiveInCallsFn(response.inCalls);
                    $scope.directiveOutCallsFn(response.outCalls);
                    return response;
                });
            }

            $scope.fetchDidCallsByHoursDatas = function() {
                var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/daily/didincommingcallsbyhours/';
                var didDate = $filter('date')($scope.dailyPeerDate, 'yyyy-MM-dd');
                url += didDate + 'T23:59:59Z';
                if ($scope.choiseDid.value != "") {
                    url += "/" + $scope.choiseDid.value
                }

                $scope.myts = dailyService.fetchDidCallsByHoursDatas(url);
                /* */
                $scope.didCalssByHoursDatas = $scope.myts.then(function(response) {
                    $scope.directiveDidCallsByHourFn(response);
                    return response;
                });
            }



        }
    ]);