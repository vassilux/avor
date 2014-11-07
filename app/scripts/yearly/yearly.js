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
    .controller('YearlyCtrl', ['$rootScope', '$scope', '$filter','localize','yearlyService', 'toolsService', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile',
        function($rootScope, $scope, $filter, localize, yearlyService, toolsService, DTOptionsBuilder, DTColumnBuilder, $compile) {
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
            .fromSource('')
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
                    return toolsService.secondsToHMS(data);
                })
            ];

            // peer in datas part
            $scope.dtPeerInOptions = DTOptionsBuilder
            .fromSource('')
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
                            + localize.getLocalizedString("_search.common.peer_") + ': ' +group+'</i></td></tr>');
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

            $scope.dtPeerInColumnDefs = [
                DTColumnBuilder.newColumn('peer').withTitle(localize.getLocalizedString("_search.common.peer_")).notVisible(),
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
                    return toolsService.secondsToHMS(data);
                })
            ];
            // peer in datas part end

            //peer out datas part
            $scope.dtPeerOutOptions = DTOptionsBuilder
            .fromSource('') // empty dummy source
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
                            + localize.getLocalizedString("_search.common.peer_") + ': ' +group+'</i></td></tr>');
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

            $scope.dtPeerOutColumnDefs = [
                DTColumnBuilder.newColumn('peer').withTitle(localize.getLocalizedString("_search.common.peer_")).notVisible(),
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
                    return toolsService.secondsToHMS(data);
                })
            ];
            //peer out datas part end 
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
                    $scope.DidCallsYearDirectiveFn(monthlyResponse);
                    return monthlyResponse;
                });
                //
                var sUrlDids = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + "/yearly/did/bymonth/calls/" + didDate
                if ($scope.choiseDid.value != "") {
                    sUrlDids += "/" + $scope.choiseDid.value
                }
                //workaround for jquery ajax cache
                sUrlDids += "/" + (new Date()).getTime();
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
                    $scope.directiveOutCallsYearFn(peerOutCalls);
                    return peerOutCalls;
                });
                //in calls for peer(s)
                $scope.loadPeersByMonthCalls($scope.dtPeerInOptions, "/yearly/peer/in/bymonth/calls/", peerDate, $scope.choisePeer.value)
                 //out calls for peer(s)
                $scope.loadPeersByMonthCalls($scope.dtPeerOutOptions, "/yearly/peer/out/bymonth/calls/", peerDate, $scope.choisePeer.value)
                
            }

            $scope.loadPeersByMonthCalls = function(dtOptions, url, peerDate, peer) {
                var sUrlPeer = "http://" + $rootScope.config.host + ":" + $rootScope.config.port + url + peerDate
                if (peer != "") {
                    sUrlPeer += "/" + peer
                }
                //workaround for jquery ajax cache
                sUrlPeer += "/" + (new Date()).getTime();
                dtOptions.sAjaxSource = sUrlPeer;
                dtOptions.reloadData();
            }


        }
    ]);