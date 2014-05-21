'use strict';

angular.module('app')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/yearly', {
                templateUrl: 'scripts/yearly/yearly.tpl.html',
                controller: 'YearlyCtrl'

            });
        }
    ])
    .controller('YearlyCtrl', ['$rootScope', '$scope', '$filter', 'yearlyService',
        function($rootScope, $scope, $filter, yearlyService) {
            //
            $scope.didsTarget = "dids"
            $scope.peersTarget = "peers"
            $scope.choiseDid = {};
            $scope.choisePeer = {};
            $scope.myFormat = "yyyy"
            $scope.titleDIDCalls = "Did calls";
            $scope.titleInCalls = "Incomming calls";
            $scope.titleOutCalls = "Outgoingcalls";

            //
            $scope.didDate = new Date();
            $scope.peerDate = new Date();
            $scope.searchShow = true;
            $scope.searchShowError = false;
            //
            $scope.setInCallsDirectiveFn = function(directiveFn) {
                $scope.directiveInCallsFn = directiveFn
            }

            $scope.setOutCallsDirectiveFn = function(directiveFn) {
                $scope.directiveOutCallsFn = directiveFn
            }

            $scope.setDidCallsDirectiveFn = function(directiveFn) {
                $scope.directiveDidCallsFn = directiveFn
            }

            $scope.fetchDidDatas = function() {
                var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/yearly/didincomming/';
                var didDate = $filter('date')($scope.didDate, 'yyyy');
                url += didDate
                if ($scope.choiseDid.value != "") {
                    url += "/" + $scope.choiseDid.value
                }
                $scope.myts = yearlyService.fetchDidDatas(url);
                $scope.didDatas = $scope.myts.then(function(response) {
                    console.log("response : " + JSON.stringify(response));
                    //processDidData(response);
                    $scope.directiveDidCallsFn(response);
                    return response;
                });
            }

            $scope.fetchPeerDatas = function() {
                var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/yearly/peerdatas/';
                var peerDate = $filter('date')($scope.peerDate, 'yyyy');
                url += peerDate;
                if ($scope.choisePeer.value != "") {
                    url += "/" + $scope.choisePeer.value
                }
                $scope.myts = yearlyService.fetchPeerDatas(url);
                $scope.didDatas = $scope.myts.then(function(response) {
                    console.log("response : " + JSON.stringify(response));
                    //processPeerIncommingData(response.inCalls);
                    $scope.directiveInCallsFn(response.inCalls);
                    //processPeerOutgoingData(response.outCalls);
                    $scope.directiveOutCallsFn(response.outCalls);
                    //processDidData(response);
                    return response;
                });
            }



        }
    ]);