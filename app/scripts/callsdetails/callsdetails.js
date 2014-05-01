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

        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };

       
        $scope.message = '';

        $scope.myCallback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function() {
                $scope.$apply(function() {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function(info) {
            $scope.message = 'clicked: ' + info.price;
        };

        $scope.columnDefs = [{
            "mDataProp": "clidName",
            "aTargets": [0]
        }, {
            "mDataProp": "clidNumber",
            "aTargets": [1]
        }, {
            "mDataProp": "dst",
            "aTargets": [2]
        }, {
            "mDataProp": "dnid",
            "aTargets": [3]
        },{
            "mDataProp": "duration",
            "aTargets": [4]
        }, {
            "mDataProp": "billSec",
            "aTargets": [5]
        }, {
            "mDataProp": "answerWaitTime",
            "aTargets": [6]
        },{
            "mDataProp": "disposition",
            "aTargets": [7]
        },{
            "mDataProp": "inoutStatus",
            "aTargets": [8]
        }];

        $scope.cdrOverrideOptions = {
            "bStateSave": true,
            "iCookieDuration": 2419200,
            /* 1 month */
            "bJQueryUI": true,
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": true,
            "bDestroy": true
        };
        $scope.cdrCategories = []


        $scope.fetchCdrDatasClickHandler = function() {
            var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/cdrs/2013-02-01T00:00:00Z/2015-04-22T01:00:00Z';
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
    });