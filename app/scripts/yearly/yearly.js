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
    .controller('YearlyCtrl', ['$rootScope', '$scope', '$filter','localize','yearlyService', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile',
        function($rootScope, $scope, $filter, localize, yearlyService, DTOptionsBuilder, DTColumnBuilder, $compile) {
            //
            $scope.didsTarget = "dids"
            $scope.peersTarget = "peers"
            $scope.choiseDid = {};
            $scope.choisePeer = {};
            $scope.myFormat = "yyyy"
            $scope.titleDIDCalls =  localize.getLocalizedString("_chart.common.sda.title_");
            $scope.titleInCalls = localize.getLocalizedString("_chart.common.peer.in.title_");
            $scope.titleOutCalls = localize.getLocalizedString("_chart.common.peer.out.title_");

            //
            /**
            Helpers for formating calls duration
            */
            $scope.SecondsToHMS = function (d)
            {
                d = Number(d);
                var h = Math.floor(d / 3600);
                var m = Math.floor(d % 3600 / 60);
                var s = Math.floor(d % 3600 % 60);
                var hr = $scope.format(h);
                var min = $scope.format(m);
                var sec = $scope.format(s);
                var val = hr + ':' + min + ':' + sec;
                return val;
            }
                         
            $scope.format = function(num)
            {
                var val='0'
                if (num > 0){
                    if (num >= 10)
                        val = num;
                    else
                        val = '0' + num;
                    }
                    else
                        val = '00';
                        return val;
            }

            //
            $scope.didDate = new Date();
            $scope.peerDate = new Date();
            $scope.searchShow = true;
            $scope.searchShowError = false;
            //
            $scope.setInCallsDirectiveFn = function(directiveFn) {
                $scope.directiveInCallsFn = directiveFn
            }

            $scope.setInCallsYearDirectiveFn = function(directiveFn) {
                $scope.directiveInCallsYearFn = directiveFn
            }

            $scope.setOutCallsDirectiveFn = function(directiveFn) {
                $scope.directiveOutCallsFn = directiveFn
            }

            $scope.setOutCallsYearDirectiveFn = function(directiveFn) {
                $scope.directiveOutCallsYearFn = directiveFn
            }

            $scope.setDidCallsDirectiveFn = function(directiveFn) {
                $scope.directiveDidCallsFn = directiveFn
            }

            $scope.setDidCallsYearDirectiveFn = function(directiveFn) {
                $scope.DidCallsYearDirectiveFn = directiveFn
            }

            $scope.didCallsTableSearchCallback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td:eq(0)', nRow).bind('dblclick', function() {
                    $scope.$apply(function() {
                        
                    });
                });
                return nRow;
            };

            var langUrl = "i18n/datatable_en-US.json";
            if (localize.language == "fr-FR") {
                langUrl = "i18n/datatable_fr-FR.json"
            }

            $scope.dtOptions = DTOptionsBuilder
            .fromSource('testdata/yeardidcallsdataempty.json')
            .withOption('createdRow', function(row, data, dataIndex) {
                    // Recompiling so we can bind Angular directive to the DT
                    $compile(angular.element(row).contents())($scope);
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
            //make grouping by DID
            .withOption('fnDrawCallback', function ( oSettings  ) {
                var api = this.api();
                var rows = api.rows( {page:'current'} ).nodes();
                var last=null;
                 
                api.column(0, {page:'current'} ).data().each( function ( group, i ) {
                    if ( last !== group ) {
                        $(rows).eq( i ).before(
                            '<tr class="group"><td colspan="5">  <i class="fa fa-phone"> '
                            + localize.getLocalizedString("_year_dids_table_column_did_") + ': ' +group+'</i></td></tr>');
                            last = group;
                    }
                } );
                            
                            
            })
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
                DTColumnBuilder.newColumn('did').withTitle(localize.getLocalizedString("_year_dids_table_column_did_")).notVisible(),
                DTColumnBuilder.newColumn('month').withTitle(localize.getLocalizedString("_year_dids_table_column_month_"))
                .renderWith(function(data, type, full, meta) {
                    var monthKey = "_year_month_" + data + "_"
                    return localize.getLocalizedString(monthKey);
                }),
                DTColumnBuilder.newColumn('calls').withTitle(localize.getLocalizedString("_year_dids_table_column_calls_")),
                DTColumnBuilder.newColumn('missing').withTitle(localize.getLocalizedString("_year_dids_table_column_missing_")),
                DTColumnBuilder.newColumn('percent').withTitle('%')
                .renderWith(function(data, type, full, meta) {                    
                    return  Math.round(data) + "%" ;
                }),
                DTColumnBuilder.newColumn('duration').withTitle(localize.getLocalizedString("_year_dids_table_column_duration_")).notSortable()
                .renderWith(function(data, type, full, meta) {                    
                    return $scope.SecondsToHMS(data);
                })
            ];

            $scope.fetchDidDatas = function() {
                var url = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + '/yearly/didincomming/';
                var didDate = $filter('date')($scope.didDate, 'yyyy');
                url += didDate
                if ($scope.choiseDid.value != "") {
                    url += "/" + $scope.choiseDid.value
                }
                $scope.myts = yearlyService.fetchDidDatas(url);
                $scope.didDatas = $scope.myts.then(function(response) {
                    $scope.directiveDidCallsFn(response);
                    return response;
                });
                var monthUrl = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/yearly/did/in/bymonth/"
                monthUrl += didDate
                if ($scope.choiseDid.value != "") {
                    monthUrl += "/" + $scope.choiseDid.value
                }
                $scope.bymonth = yearlyService.fetchDidDatas(monthUrl);
                $scope.didMonthDatas = $scope.bymonth.then(function(monthlyResponse) {
                    //console.log("response by month : " + JSON.stringify(monthlyResponse));
                    $scope.DidCallsYearDirectiveFn(monthlyResponse);
                    return monthlyResponse;
                });
                //just
                var sUrlDids = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/yearly/did/bymonth/calls/" + didDate
                if ($scope.choiseDid.value != "") {
                    sUrlDids += "/" + $scope.choiseDid.value
                }
                //sUrlDids += "/" + new Date().getTime();
               // $scope.dtOptions.sAjaxSource = sUrlDids; //'testdata/yeardidcallsdata.json'
                //$scope.dtOptions.withDataProp('testdata/yeardidcallsdata.json')
                //$scope.dtOptions.sAjaxSource = 'testdata/cdrsempty.json'
                //$scope.dtOptions.reloadData();
                $scope.dtOptions.sAjaxSource = sUrlDids;
                $scope.dtOptions.reloadData();
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
                    //console.log("response : " + JSON.stringify(response));
                    $scope.directiveInCallsFn(response.inCalls);
                    $scope.directiveOutCallsFn(response.outCalls);
                    return response;
                });

                var monthInUrl = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/yearly/peer/in/bymonth/"
                monthInUrl += peerDate
                if ($scope.choisePeer.value != "") {
                    monthInUrl += "/" + $scope.choisePeer.value
                }
                $scope.byPeerInMonth = yearlyService.fetchDidDatas(monthInUrl);
                $scope.peerInMonthDatas = $scope.byPeerInMonth.then(function(peerInCalls) {
                    console.log("response by byPeerInMonth : " + JSON.stringify(peerInCalls));
                    $scope.directiveInCallsYearFn(peerInCalls);
                    return peerInCalls;
                });
                //
                var monthOutUrl = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/yearly/peer/out/bymonth/"
                monthOutUrl += peerDate
                if ($scope.choisePeer.value != "") {
                    monthOutUrl += "/" + $scope.choisePeer.value
                }

                $scope.byPeerOutMonth = yearlyService.fetchDidDatas(monthOutUrl);
                $scope.peerOutMonthDatas = $scope.byPeerOutMonth.then(function(peerOutCalls) {
                    console.log("response by byPeerOutMonth : " + JSON.stringify(peerOutCalls));
                    $scope.directiveOutCallsYearFn(peerOutCalls);
                    return peerOutCalls;
                });
            }


        }
    ]);