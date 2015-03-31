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
    .controller('CallsDetailsCtrl', ['$rootScope', '$scope', '$resource', '$timeout', '$http', '$q', '$filter', '$dialog', 
        'cdrService', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', 'localize', 'dialogs',
     function($rootScope, $scope, $resource, $timeout, $http, $q, $filter, $dialog, cdrService, DTOptionsBuilder, DTColumnBuilder, $compile, localize, dialogs) {
        //

        $scope.didsTarget = "dids"
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
        $scope.timeFrom = new Date();
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
        $scope.choiseDid = ""

        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:-0'
        };

        $scope.message = '';

            var langUrl = "i18n/datatable_en-US.json";
            if (localize.language == "fr-FR") {
                langUrl = "i18n/datatable_fr-FR.json"
            }

            $scope.dtOptions = DTOptionsBuilder
            .fromSource('')
           .withOption('createdRow', function(row, data, dataIndex) {
                    // Recompiling so we can bind Angular directive to the DT
                    $compile(angular.element(row).contents())($scope);
            })
            .withOption('rowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
                $('td', nRow).unbind('click');
                $('td', nRow).bind('click', function() {
                    $scope.fetchCdrDetailsClickHandler(aData)
                });
                return nRow;
            })
           .withOption('processing', function() {
                return true;
            })            
            .withOption('stateLoaded', function(settings, data) {
                console.log( 'Saved filter was: '+data.oSearch.sSearch );
            })

            .withLanguage({
                sUrl: langUrl
            })
            .withBootstrap()
            // Overriding the classes
            .withBootstrapOptions({
                TableTools: {
                    classes: {
                        container: 'btn-group',
                        buttons: {
                            normal: 'btn btn-danger'
                        }
                    }
                },
                ColVis: {
                    classes: {
                        masterButton: 'btn btn-primary'
                    }
                }
            })
            // Add ColVis compatibility
            .withColVis()
            .withPaginationType('full_numbers')
            .withTableTools('vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf')
            .withTableToolsButtons([
                'copy',
                'print', {
                    'sExtends': 'collection',
                    'sButtonText': 'Save',
                    'aButtons': ['csv', 'xls', 'pdf']
                }
            ]);
           
            $scope.dtColumnDefs = [
                 DTColumnBuilder.newColumn('call_date').withTitle(localize.getLocalizedString("_cdrs.search.datatables.column.call_date_"))
                 .renderWith(function(data, type, full, meta) {
                     var jsDate = new Date(data);
                             jsDate = $filter('date')(jsDate, 'dd-MM-yyyy HH:mm:ss');
                             return "<div class='date'><i class='fa fa-eye'></i>&nbsp;" + jsDate + "</div>";
                 }),
                 DTColumnBuilder.newColumn('clid_name').withTitle(localize.getLocalizedString("_cdrs.search.datatables.column.caller_name_")),
                 DTColumnBuilder.newColumn('clid_number').withTitle(localize.getLocalizedString("_cdrs.search.datatables.column.caller_number_")),
                 DTColumnBuilder.newColumn('dst').withTitle(localize.getLocalizedString("_cdrs.search.datatables.column.destination_")),
                 DTColumnBuilder.newColumn('peer').withTitle("Peer"),
                 DTColumnBuilder.newColumn('did').withTitle(localize.getLocalizedString("_cdrs.search.datatables.column.did_")),
                 DTColumnBuilder.newColumn('duration').withTitle(localize.getLocalizedString("_cdrs.search.datatables.column.duration_")).notSortable()
                 .renderWith(function(data, type, full, meta) {
                    return data + 's';
                 }),
                 DTColumnBuilder.newColumn('billsec').withTitle(localize.getLocalizedString("_cdrs.search.datatables.column.bill_")).notSortable()
                 .renderWith(function(data, type, full, meta) {
                    return data + 's';
                 }),
                 DTColumnBuilder.newColumn('answer_wait_time').withTitle(localize.getLocalizedString("_cdrs.search.datatables.column.answer_wait_time_")).notSortable()
                 .renderWith(function(data, type, full, meta) {
                    return data + 's';
                 }),
                 DTColumnBuilder.newColumn('disposition_str').withTitle(localize.getLocalizedString("_cdrs.search.datatables.column.hangup_cause_")).notSortable()
                 .renderWith(function(data, type, full, meta) {
                    if (data == "ANSWERED") {
                        return localize.getLocalizedString("_cdrs.search.cause.option.answer_");
                    }else if (data == "NO ANSWER") {
                        return localize.getLocalizedString("_cdrs.search.cause.option.non_answer_");
                    }else if (data == "NOANSWER") {
                        return localize.getLocalizedString("_cdrs.search.cause.option.non_answer_");
                    } else if (data == "BUSY") {
                        return localize.getLocalizedString("_cdrs.search.cause.option.busy_");
                    }else if (data == "CANCEL") {
                        return localize.getLocalizedString("_cdrs.search.cause.option.cancel_");
                    }else if (data == "FAILED") {
                        return localize.getLocalizedString("_cdrs.search.cause.option.failed_");
                    }else if (data == "CONGESTION") {
                        return localize.getLocalizedString("_cdrs.search.cause.option.congestion_");
                    } else {
                        return data;
                    }
                 }),
                DTColumnBuilder.newColumn('inout_status').withTitle(localize.getLocalizedString("_cdrs.search.datatables.column.direction_")).notSortable()
                 .renderWith(function(data, type, full, meta) {
                    if (data == "1") {
                        return localize.getLocalizedString("_cdrs.search.direction.option.out_");
                    }else if (data == "2") {
                        return localize.getLocalizedString("_cdrs.search.direction.option.in_");
                    } else if (data == "3") {
                        return localize.getLocalizedString("_cdrs.search.direction.option.internal_");
                    }else {
                        return data;
                    }
                 }),
            ];

        $scope.fetchCdrDetailsClickHandler = function(cdr) {
            if (cdr.uniqueId == undefined) {
                console.log("Oups uniqueId is undefined.")
                return
            }
            var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/cdrdetails/" + cdr.uniqueId;            

            $scope.cdrDetails = cdrService.fetchDetails(url);
            $scope.pollcdrDetailsData = $scope.cdrDetails.then(function(response) {
                var callDetails = response[0].callDetails;
                           
                var data = {'currentCdr': cdr, 'cdrDetails': callDetails}

                var dlg = dialogs.create('scripts/callsdetails/calldetailsdialog.tpl.html','CallDetailsCtrl', data,
                    {}, {size:'lg'});
                    dlg.result.then(function(){
                        
                    },function(){
                        
                    });

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

        $scope.changeData = function(url) {
           
            if (url == $scope.dtOptions.sAjaxSource) {
                $scope.dtOptions.reloadData();
            }else {
                $scope.dtOptions.sAjaxSource = url
            }
        }

        $scope.fetchCdrDatasClickHandler = function() {
            var stringDateFrom = $filter('date')($scope.dateFrom, 'yyyy-MM-ddTHH:mm:ss');
            var stringDateTo = $filter('date')($scope.dateTo, 'yyyy-MM-ddTHH:mm:ss');
            var request = "/cdrs/startdate,$gte," + stringDateFrom + 'Z';
            request += "&enddate,$lte," + stringDateTo + 'Z';
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

                if ($scope.destinationCondition == "") {
                    request += "&destination,," + $scope.destination;
                } else {
                    var value = helperRegExCondition($scope.destinationCondition, $scope.destination)
                    request += "&destination,$regex," + value;
                }

            };
            if ($scope.callerId.length > 0) {

                if ($scope.callerIdCondition == "") {
                    request += "&callerid,," + $scope.callerId;
                } else {
                    var value = helperRegExCondition($scope.callerIdCondition, $scope.callerId)
                    request += "&callerid,$regex," + value;
                }

            };
            if ($scope.choiseDid.value != "") {
                    request += "&did,=," + $scope.choiseDid.value
            }
            //
            var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + request
            
            $scope.changeData(url)

            
        };
    }
    ])

.controller('CallDetailsCtrl',['$scope','$modalInstance', 'data', function($scope,$modalInstance, data){
        $scope.currentCdr = data.currentCdr;
        $scope.callDetails = data.cdrDetails;        
       
        $scope.close = function(){
            $modalInstance.close();
        }; 
        
        $scope.hitEnter = function(evt){
            $scope.close();
        };
    }
    ]);