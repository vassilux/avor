'use strict';

angular.module('app')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/callsdetails', {
                templateUrl: 'scripts/callsdetails/callsdetails.tpl.html',
                controller: 'CallsDetailsCtrl'

            });
        }
    ])
    .controller('CallsDetailsCtrl', function($rootScope, $scope, $timeout, $filter, $dialog, cdrService) {
        //
        $scope.dialogCallDetailsOptions = {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            resolve: {
                items: function() {
                    return $scope.cdrDetails;
                },
                cdr: function() {
                    return $scope.currentCdr;
                }
            },
            dialogClass: 'modal cdrDetails',
            controller: 'CallDetailsCtrl',
            templateUrl: 'scripts/callsdetails/calldetailsdialog.tpl.html'
        };
        //
        $scope.dateFrom = new Date();
        $scope.dateTo = new Date();
        $scope.hangupdCause = ""
        $scope.duration = ""
        $scope.durationCondition = ""
        $scope.destination = ""
        $scope.destinationCondition = ""
        $scope.callerId = ""
        $scope.callerIdCondition = ""
        $scope.choiseDirection = ""
        $scope.cdrDetails = []
        $scope.currentCdr = {};
        $scope.searchShow = true;

        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };


        $scope.message = '';

        function format(d) {
            // `d` is the original data object for the row
            return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
                '<tr>' +
                '<td>Full name:</td>' +
                '<td>' + d.name + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>Extension number:</td>' +
                '<td>' + d.extn + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>Extra info:</td>' +
                '<td>And any further details here (images etc)...</td>' +
                '</tr>' +
                '</table>';
        }


        $scope.cdrSearchCallback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(0)', nRow).bind('dblclick', function() {
                $scope.$apply(function() {
                    $scope.fetchCdrDetailsClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.fetchCdrDetailsClickHandler = function(cdr) {
            if (cdr.uniqueId == undefined) {
                console.log("Oups uniqueId is undefined.")
            }
            var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/cdrdetails/" + cdr.uniqueId;
            $scope.cdrDetails = cdrService.fetchDetails(url);
            $scope.pollcdrDetailsData = $scope.cdrDetails.then(function(response) {
                var callDetails = response[0].callDetails;
                $scope.cdrDetails.length = 0;
                var newCdrDetails = [];
                for (var i = 0; i < callDetails.length; i++) {
                    newCdrDetails.push(callDetails[i]);
                }
                $scope.cdrDetails = newCdrDetails;
                $scope.message = 'Get ' + $scope.cdrDetails.length + " details for the call with uniqueid " + cdr.uniqueId;
                //
                angular.copy(cdr, $scope.currentCdr);
                //
                var d = $dialog.dialog($scope.dialogCallDetailsOptions)
                d.open()
                    .then(function(result) {

                        newCdrDetails = undefined;
                    });

                //
                return response;
            });

        };

 
        $scope.cdrCategories = []

        function helperRegExCondition(condition, value) {
            //helper for build regular expression passed to the serveur side
            var result = "";
            if (condition == "beginswith") {
                result = "^" + value
            } else if (condition == "endwith") {
                result = value + "$"
            } else {
                result = value
            }
            return result
        }

        $scope.fetchCdrDatasClickHandler = function() {
            var stringDateFrom = $filter('date')($scope.dateFrom, 'yyyy-MM-dd');
            var stringDateTo = $filter('date')($scope.dateTo, 'yyyy-MM-dd');
            var request = "/cdrs/startdate,$gte," + stringDateFrom + 'T00:00:00Z';
            request += "&enddate,$lte," + stringDateTo + 'T23:59:59Z';
            if ($scope.hangupdCause.length > 0) {
                request += "&disposition,," + $scope.hangupdCause;
            }

            if ($scope.choiseDirection.length > 0) {
                request += "&direction,," + $scope.choiseDirection;
            }
            if ($scope.duration.length > 0) {
                request += "&duration," + $scope.durationCondition + "," + $scope.duration;
            }
            if ($scope.destination.length > 0) {
                console.log("$scope.destinationCondition : " + $scope.destinationCondition)
                if ($scope.destinationCondition == "") {
                    request += "&destination,," + $scope.destination;
                } else {
                    var value = helperRegExCondition($scope.destinationCondition, $scope.destination)
                    request += "&destination,$regex," + value;
                }

            };
            if ($scope.callerId.length > 0) {
                console.log("$scope.callerId : " + $scope.callerId)
                if ($scope.callerIdCondition == "") {
                    request += "&callerid,," + $scope.callerId;
                } else {
                    var value = helperRegExCondition($scope.callerIdCondition, $scope.callerId)
                    request += "&callerid,$regex," + value;
                }

            };
            //
            var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + request
            //"/cdrs/" + stringDateFrom + 'T00:00:00Z/' + stringDateTo + 'T23:59:59Z';
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
    })

.controller('CallDetailsCtrl', function($rootScope, $scope, $timeout, $filter, dialog, items, cdr) {
    $scope.callDetails = items;
    $scope.currentCdr = cdr;
    console.log(" $scope.callDetails :  " + JSON.stringify($scope.callDetails))
    console.log('CallDetailsCtrl create')

    $scope.close = function() {
        dialog.close(undefined);
    };
});