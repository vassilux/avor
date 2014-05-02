'use strict';

angular.module('app')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/callsdetails', {
                templateUrl: 'scripts/callsdetails/callsdetails.tpl.html',
                controller: 'CallsdetailsCtrl'

            });
        }
    ])
    .controller('CallsdetailsCtrl', function($rootScope, $scope, $timeout, $filter, cdrService) {
        //
        $scope.dateFrom = new Date(); //$filter('date')(Date.now(),'dd-mm-yy'); 
        $scope.dateTo = new Date();
        $scope.txtFrom = $filter('date')($scope.dateFrom,'dd-mm-yy');
        $scope.cdrDetails= []

        $scope.searchShow=true;

        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };

       
        $scope.message = '';

        $scope.cdrSearchCallback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            console.log("$scope.cdrSearchCallback");
            $('td:eq(0)', nRow).bind('dblclick', function() {
                $scope.$apply(function() {
                    $scope.fetchCdrDetailsClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.fetchCdrDetailsClickHandler = function(cdr) {
            if(cdr.uniqueId == undefined ){
                console.log("Oups uniqueId is undefined.")
            }
            var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/cdrdetails/" + cdr.uniqueId;
            $scope.cdrDetails = cdrService.fetchDetails(url);
            $scope.pollcdrDetailsData = $scope.cdrDetails.then(function(response) {
                console.log(" pollcdrDetailsData " + response)
                var callDetails = response[0].callDetails;
                $scope.cdrDetails.length = 0;
                var newCdrDetails = [];
                for (var i = 0; i < callDetails.length; i++) {
                    newCdrDetails.push(callDetails[i]);
                }
                $scope.cdrDetails = newCdrDetails;
                $scope.message = 'Get ' + $scope.cdrDetails.length + " details for the call with uniqueid " + cdr.uniqueId;
                return response;
            });
            
        };

        $scope.columnDefs = [{
            "mDataProp": "call_date",
            "aTargets": [0],
            "bSortable": true,
            "fnRender": function(oObj){
                var jsDate = new Date(oObj.aData.call_date);
                jsDate = $filter('date')(jsDate,'dd-MM-yyyy HH:mm:ss'); 
                return "<div class='date'>" + jsDate + "</div>";

            }
        },{
            "mDataProp": "clid_name",
            "aTargets": [1]
        }, {
            "mDataProp": "clid_number",
            "aTargets": [2]
        }, {
            "mDataProp": "dst",
            "aTargets": [3]
        }, {
            "mDataProp": "dnid",
            "aTargets": [4]
        },{
            "mDataProp": "duration",
            "aTargets": [5]
        }, {
            "mDataProp": "billsec",
            "aTargets": [6]
        }, {
            "mDataProp": "answer_wait_time",
            "aTargets": [7]
        },{
            "mDataProp": "disposition",
            "aTargets": [8]
        },{
            "mDataProp": "inout_status",
            "aTargets": [9]
        }];

        $scope.cdrOverrideOptions = {
            "bStateSave": true,
            "iCookieDuration": 2419200,
            /* 1 month */
            "bJQueryUI": true,
            "bPaginate": true,
            "bLengthChange": true,
            "bFilter": true,
            "bInfo": true,
            "bDestroy": true
        };
        $scope.cdrCategories = []


        $scope.fetchCdrDatasClickHandler = function() {
            var stringDateFrom = $filter('date')($scope.dateFrom,'yyyy-MM-dd'); 
            var stringDateTo = $filter('date')($scope.dateTo,'yyyy-MM-dd');
            var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/cdrs/" + stringDateFrom + 'T00:00:00Z/' + stringDateTo + 'T23:59:59Z';
            $scope.cdrs = cdrService.fetch(url);
            $scope.pollData = $scope.cdrs.then(function(response) {
                var newCdrs = [];
                for (var i = 0; i < response.length; i++) {
                    newCdrs.push(response[i]);
                }
                $scope.cdrCategories = newCdrs;
                return response;
            });

        };

        $scope.toggleShowSearch = function(){
            $scope.searchShow = !$scope.searchShow;
        }
    });