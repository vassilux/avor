'use strict';

angular.module('app')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/monthly', {
                templateUrl: 'scripts/monthly/monthly.tpl.html',
                controller: 'MonthlyCtrl'

            });
        }
    ])
    .controller('MonthlyCtrl', ['$rootScope', '$scope', '$filter', 'localize', 'monthlyService',
        function($rootScope, $scope, $filter, localize, monthlyService) {
            //
            $scope.didsTarget = "dids"
            $scope.peersTarget = "peers"
            $scope.choiseDid = {};
            $scope.choisePeer = {};
            $scope.myFormat = "MM yyyy"
            $scope.titleDIDCalls =  localize.getLocalizedString("_chart.common.sda.title_");
            $scope.titleInCalls = localize.getLocalizedString("_chart.common.peer.in.title_");
            $scope.titleOutCalls = localize.getLocalizedString("_chart.common.peer.out.title_");

            //
            $scope.didDate = new Date();
            $scope.peerDate = new Date();
            $scope.searchShow = true;
            $scope.searchShowError = false;
            //
            $scope.setInCallsDirectiveFn = function(directiveFn){
                $scope.directiveInCallsFn = directiveFn
            }

            $scope.setInCallsMonthDaysDirectiveFn = function(directiveFn){
                $scope.directiveInCallsByDaysFn = directiveFn
            }
            

            $scope.setOutCallsDirectiveFn = function(directiveFn){
                $scope.directiveOutCallsFn = directiveFn
            }

            $scope.setOutCallsMonthDaysDirectiveFn = function(directiveFn){
                $scope.directiveOutCallsByDaysFn = directiveFn
            }

            $scope.setDidCallsDirectiveFn = function(directiveFn){
                $scope.directiveDidCallsFn = directiveFn
            }

            $scope.setDidCallsMonthDirectiveFn = function(directiveFn){
                $scope.directiveDidMonthCallsFn = directiveFn
            }

            

            $scope.fetchDidDatas = function() {
                //console.log("$scope.fetchDidDatas : " + $scope.didDate)
                var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/monthly/didincomming/';
                var didDate = $filter('date')($scope.didDate, 'yyyy-MM-dd');
                url += didDate + 'T23:59:59Z';
                if ($scope.choiseDid.value != "") {
                    url += "/" + $scope.choiseDid.value
                }
                $scope.myDidts = monthlyService.fetchDidDatas(url);
                $scope.didDatas = $scope.myDidts.then(function(response) {
                    //console.log("response : " + JSON.stringify(response));
                    $scope.directiveDidCallsFn(response)
                    return response;
                });
                //
                var urlDidBDays = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/monthly/did/in/bydays/';
                urlDidBDays += didDate + 'T23:59:59Z';
                if ($scope.choiseDid.value != "") {
                    urlDidBDays += "/" + $scope.choiseDid.value
                }
                $scope.myDidDaysts = monthlyService.fetchDidDatas(urlDidBDays);
                $scope.didDatas = $scope.myDidDaysts.then(function(response) {
                    //console.log("response : " + JSON.stringify(response));
                    $scope.directiveDidMonthCallsFn(response)
                    return response;
                });
            }

            $scope.fetchPeerDatas = function() {
                var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/monthly/peerdatas/';
                var peerDate = $filter('date')($scope.peerDate, 'yyyy-MM-dd');
                url += peerDate + 'T23:59:59Z';
                if ($scope.choisePeer.value != "") {
                    url += "/" + $scope.choisePeer.value
                }
                $scope.mytPeersData = monthlyService.fetchPeerDatas(url);
                $scope.peersDatas = $scope.mytPeersData.then(function(response) {
                    $scope.directiveInCallsFn(response.inCalls);
                    $scope.directiveOutCallsFn(response.outCalls);
                    return response;
                });
                //
                
                var urlInPeerByDays = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/monthly/peer/in/bydays/';
                urlInPeerByDays += peerDate + 'T23:59:59Z';
                 if ($scope.choisePeer.value != "") {
                    urlInPeerByDays += "/" + $scope.choisePeer.value
                }
                $scope.mytPeersInByDaysData = monthlyService.fetchPeerDatas(urlInPeerByDays);
                $scope.peersDatasByDays = $scope.mytPeersInByDaysData.then(function(peerInDataResponse) {
                    $scope.directiveInCallsByDaysFn(peerInDataResponse);
                    return peerInDataResponse;
                });

                var urlOutPeerByDays = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/monthly/peer/out/bydays/';
                urlOutPeerByDays += peerDate + 'T23:59:59Z';
                 if ($scope.choisePeer.value != "") {
                    urlOutPeerByDays += "/" + $scope.choisePeer.value
                }
                $scope.mytPeersOutByDaysData = monthlyService.fetchPeerDatas(urlOutPeerByDays);
                $scope.peersDatasByDays = $scope.mytPeersOutByDaysData.then(function(peerOutDataResponse) {
                    $scope.directiveOutCallsByDaysFn(peerOutDataResponse);
                    return peerOutDataResponse;
                });
            }



        }
    ]);