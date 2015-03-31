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
    .controller('MonthlyCtrl', ['$rootScope', '$scope', '$filter', 'localize', 'monthlyService', 'toolsService',
        function($rootScope, $scope, $filter, localize, monthlyService, toolsService) {
            //
            $scope.didsTarget = "dids"
            $scope.peersTarget = "peers"
            $scope.choiseDid = {};
            $scope.choisePeer = {};
            $scope.myFormat = "MM-yyyy"
            $scope.titleDIDCalls =  localize.getLocalizedString("_chart.common.sda.title_");
            $scope.titleInCalls = localize.getLocalizedString("_chart.common.peer.in.title_");
            $scope.titleOutCalls = localize.getLocalizedString("_chart.common.peer.out.title_");

            $scope.titleInCallsDisposition = localize.getLocalizedString("_chart.common.peer.disposition.in.title_");
            $scope.titleOutCallsDisposition = localize.getLocalizedString("_chart.common.peer.disposition.out.title_");

            //
            $scope.didDate = new Date();
            $scope.peerDate = new Date();
            $scope.searchShow = true;
            $scope.sdaShow = true;
            $scope.peerShow = true;
            $scope.searchShowError = false;
            $scope.peersGlobalStats = {}
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

            $scope.setInCallsDispositionDirectiveFn = function(directiveFn){
                $scope.directiveInCallsDispositionFn = directiveFn
            }

            $scope.setOutCallsDispositionDirectiveFn = function(directiveFn){
                $scope.directiveOutCallsDispositionFn = directiveFn
            }

            function loadCallsDispositions (inout, peerDate, peer,  fn){
                var callsdispurl = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/monthly/peer/' + inout + '/disposition/' + 
                peerDate + 'T23:59:59Z';

                if (peer != "") {
                    callsdispurl += "/" + peer
                }
                
                callsdispurl += "/" + (new Date()).getTime();

                var callsdisp = monthlyService.fetchPeerDatas(callsdispurl);
                callsdisp.then(function(response) {
                    //
                    fn(response)
                });
            }

            function loadPeersGeneralStats(peerDate, peer) {
                var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/monthly/peer/globalstats/' +
                    peerDate + 'T23:59:59Z';

                if (peer != "") {
                    url += "/" + peer
                }

                url += "/" + (new Date()).getTime();

                var promiseGenStats = monthlyService.fetchPeerDatas(url);
                promiseGenStats.then(function(response) {
                    //

                    angular.copy(response, $scope.peersGlobalStats);
                    $scope.peersGlobalStats.outCallsDuration = toolsService.secondsToHMS(response.outCallsDuration)
                    $scope.peersGlobalStats.outCallsAvgDuration = toolsService.secondsToHMS(response.outCallsAvgDuration)
                    $scope.peersGlobalStats.inCallsDuration = toolsService.secondsToHMS(response.inCallsDuration)
                    $scope.peersGlobalStats.inCallsAvgDuration = toolsService.secondsToHMS(response.inCallsAvgDuration)
                    $scope.peersGlobalStats.inCallsAvgWaitAnswerTime = toolsService.secondsToHMS(response.inCallsAvgWaitAnswerTime)
                });

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

                loadCallsDispositions("in", peerDate, $scope.choisePeer.value, $scope.directiveInCallsDispositionFn) 
                loadCallsDispositions("out", peerDate, $scope.choisePeer.value, $scope.directiveOutCallsDispositionFn) 

                loadPeersGeneralStats(peerDate, $scope.choisePeer.value)
            }



        }
    ]);