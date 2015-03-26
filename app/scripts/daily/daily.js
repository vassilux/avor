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
    .controller('DailyCtrl', ['$rootScope', '$scope', '$filter', 'localize', 'dailyService', 'toolsService', 
        'dailyWeekDaysTableService', 'dailyCallsCauseTableService',
        function($rootScope, $scope, $filter, localize, dailyService, toolsService, 
            dailyWeekDaysTableService, dailyCallsCauseTableService) {
            //set urls targes please check the backoffice routes configuration
            $scope.didsTarget = "dids"
            $scope.peersTarget = "peers"
            //
            $scope.titleDIDCalls = localize.getLocalizedString("_chart.common.sda.title_");
            $scope.titleInCalls = localize.getLocalizedString("_chart.common.peer.in.title_");
            $scope.titleOutCalls = localize.getLocalizedString("_chart.common.peer.out.title_");
            $scope.titleDIDCallsByHours = localize.getLocalizedString("_chart.common.sda.hour.title_");

            $scope.titleInCallsDisposition = localize.getLocalizedString("_chart.common.peer.disposition.in.title_");
            $scope.titleOutCallsDisposition = localize.getLocalizedString("_chart.common.peer.disposition.out.title_");

            //
            $scope.choiseDid = {};
            $scope.choisePeer = {};
            //
            var yesterday =  new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            $scope.dailyDidDate = yesterday
            $scope.dailyPeerDate = yesterday
            $scope.searchShow = true;
            $scope.sdaShow = true;
            $scope.peerShow = true;
            $scope.searchShowError = false;
            //
            $scope.dtOptions = dailyCallsCauseTableService.buildDTOptions("did", $scope)
            $scope.dtColumnDefs = dailyCallsCauseTableService.buildDTColumnDefs("did")
            //did by week day and hours 
            $scope.dtDidWeekDaysOptions = dailyWeekDaysTableService.buildDTOptions()
            $scope.dtDidWeekDaysColumnDefs = dailyWeekDaysTableService.buildDTColumnDefs()
            // incomming peer table
            $scope.dtPeerInOptions = dailyCallsCauseTableService.buildDTOptions("peer", $scope)
            $scope.dtPeerInColumnDefs = dailyCallsCauseTableService.buildDTColumnDefs("peer")
            $scope.dtPeerInCallsWeekDaysOptions = dailyWeekDaysTableService.buildDTOptions()
            $scope.dtPeerInCallsWeekDaysColumnDefs = dailyWeekDaysTableService.buildDTColumnDefs()
            //end of incomming table
            //outgoing table 
            $scope.dtPeerOutOptions = dailyCallsCauseTableService.buildDTOptions("peer", $scope)
            $scope.dtPeerOutColumnDefs = dailyCallsCauseTableService.buildDTColumnDefs("peer")
            $scope.dtPeerOutCallsWeekDaysOptions = dailyWeekDaysTableService.buildDTOptions()
            $scope.dtPeerOutCallsWeekDaysColumnDefs = dailyWeekDaysTableService.buildDTColumnDefs()
            //end of outgoing table 
            //
            $scope.fetchDidDatas = function() {
                var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/daily/did/in/';
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
                //
                var sUrlDids = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/daily/did/genstats/" + didDate + 'T23:59:59Z';
                if ($scope.choiseDid.value != "") {
                    sUrlDids += "/" + $scope.choiseDid.value
                }
                //workaround for jquery ajax cache
                sUrlDids += "/" + (new Date()).getTime();
                $scope.dtOptions.sAjaxSource = sUrlDids;
                $scope.dtOptions.reloadData();
                //
                var sUrlDidsWeekDays= "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/daily/did/week/" + didDate + 'T23:59:59Z';
                if ($scope.choiseDid.value != "") {
                    sUrlDidsWeekDays += "/" + $scope.choiseDid.value
                }
                //workaround for jquery ajax cache
                sUrlDidsWeekDays += "/" + (new Date()).getTime();
                $scope.dtDidWeekDaysOptions.sAjaxSource = sUrlDidsWeekDays;
                $scope.dtDidWeekDaysOptions.reloadData();

               
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

            $scope.setPeerInCallsByHourDirectiveFn = function(directiveFn) {
                $scope.directivePeerInCallsByHourFn = directiveFn
            }

            $scope.setPeerOutCallsByHourDirectiveFn = function(directiveFn) {
                $scope.directivePeerOutCallsByHourFn = directiveFn
            }

            $scope.setInCallsDispositionDirectiveFn = function(directiveFn){
                $scope.directiveInCallsDispositionFn = directiveFn
            }

            $scope.setOutCallsDispositionDirectiveFn = function(directiveFn){
                $scope.directiveOutCallsDispositionFn = directiveFn
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
                    //
                    $scope.directiveInCallsFn(response.inCalls);
                    $scope.directiveOutCallsFn(response.outCalls);
                    $scope.directivePeerInCallsByHourFn(response.hourlyInCalls);
                    $scope.directivePeerOutCallsByHourFn(response.hourlyOutCalls);
                    return response;
                });
                //

                loadCallsDispositions("in", peerDate, $scope.choisePeer.value, $scope.directiveInCallsDispositionFn) 
                loadCallsDispositions("out", peerDate, $scope.choisePeer.value, $scope.directiveOutCallsDispositionFn) 

                $scope.loadPeersByDayCalls($scope.dtPeerInOptions, "/daily/peer/in/genstats/", peerDate + 'T23:59:59Z', $scope.choisePeer.value);
                $scope.loadPeersByDayCalls($scope.dtPeerOutOptions, "/daily/peer/out/genstats/", peerDate + 'T23:59:59Z', $scope.choisePeer.value);
                $scope.loadPeersByDayCalls($scope.dtPeerInCallsWeekDaysOptions, "/daily/peer/in/week/", peerDate + 'T23:59:59Z', $scope.choisePeer.value);
                $scope.loadPeersByDayCalls($scope.dtPeerOutCallsWeekDaysOptions, "/daily/peer/out/week/", peerDate + 'T23:59:59Z', $scope.choisePeer.value);
            }

            function loadCallsDispositions (inout, peerDate, peer,  fn){
                var callsdispurl = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/daily/peer/' + inout + '/disposition/' + 
                peerDate + 'T23:59:59Z';

                if (peer != "") {
                    callsdispurl += "/" + peer
                }
                
                callsdispurl += "/" + (new Date()).getTime();

                var callsdisp = dailyService.fetchPeerDatas(callsdispurl);
                callsdisp.then(function(response) {
                    //
                    fn(response)
                });
            }

            $scope.loadPeersByDayCalls = function(dtOptions, url, peerDate, peer) {
                var sUrlPeer = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + url + peerDate
                if (peer != "") {
                    sUrlPeer += "/" + peer
                }
                //workaround for jquery ajax cache
                sUrlPeer += "/" + (new Date()).getTime();
                dtOptions.sAjaxSource = sUrlPeer;
                dtOptions.reloadData();
            }

            $scope.fetchDidCallsByHoursDatas = function() {
                var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/daily/did/in/calls/byhours/';
                var didDate = $filter('date')($scope.dailyDidDate, 'yyyy-MM-dd');
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