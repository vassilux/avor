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
    .controller('MonthlyCtrl', ['$rootScope', '$scope', '$filter', 'monthlyService',
        function($rootScope, $scope, $filter, monthlyService) {
            //
            $scope.didsTarget = "dids"
            $scope.peersTarget = "peers"
            $scope.choiseDid = {};
            $scope.choisePeer = {};
            $scope.myFormat = "MM yyyy"
            $scope.titleDIDCalls = "Did calls";
            $scope.titleInCalls = "Incomming calls";
            $scope.titleOutCalls = "Outgoingcalls";

            //
            $scope.didDate = new Date();
            $scope.peerDate = new Date();
            $scope.searchShow = true;
            $scope.searchShowError = false;
            //
            $scope.setInCallsDirectiveFn = function(directiveFn){
                $scope.directiveInCallsFn = directiveFn
            }

            $scope.setOutCallsDirectiveFn = function(directiveFn){
                $scope.directiveOutCallsFn = directiveFn
            }

            $scope.setDidCallsDirectiveFn = function(directiveFn){
                $scope.directiveDidCallsFn = directiveFn
            }

            $scope.fetchDidDatas = function() {
                console.log("$scope.fetchDidDatas : " + $scope.didDate)
                var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/monthly/didincomming/';
                var didDate = $filter('date')($scope.didDate, 'yyyy-MM-dd');
                url += didDate + 'T23:59:59Z';
                if ($scope.choiseDid.value != "") {
                    url += "/" + $scope.choiseDid.value
                }
                $scope.myts = monthlyService.fetchDidDatas(url);
                $scope.didDatas = $scope.myts.then(function(response) {
                    console.log("response : " + JSON.stringify(response));
                    $scope.directiveDidCallsFn(response)
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
                $scope.myts = monthlyService.fetchPeerDatas(url);
                $scope.didDatas = $scope.myts.then(function(response) {
                    $scope.directiveInCallsFn(response.inCalls);
                    $scope.directiveOutCallsFn(response.outCalls);
                    return response;
                });
            }



        }
    ]);