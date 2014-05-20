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
    .controller('DailyCtrl', ['$rootScope', '$scope', '$filter', 'dailyService',
        function($rootScope, $scope, $filter, dailyService) {
            //set urls targes please check the backoffice routes configuration
            $scope.didsTarget = "dids"
            $scope.peersTarget = "peers"
            $scope.titleDIDCalls = "Did calls";
            $scope.titleInCalls =  "Incomming calls";
            $scope.titleOutCalls = "Outgoingcalls";
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
            }
            //callbacks for the direectives controllers
            $scope.setInCallsDirectiveFn = function(directiveFn){
                $scope.directiveInCallsFn = directiveFn
            }

            $scope.setOutCallsDirectiveFn = function(directiveFn){
                $scope.directiveOutCallsFn = directiveFn
            }

            $scope.setDidCallsDirectiveFn = function(directiveFn){
                $scope.directiveDidCallsFn = directiveFn
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
                $scope.didDatas = $scope.myts.then(function(response) {
                    //console.log("response : " + JSON.stringify(response));
                    $scope.directiveInCallsFn(response.inCalls);
                    $scope.directiveOutCallsFn(response.outCalls);
                    return response;
                });
            }



        }
    ]);