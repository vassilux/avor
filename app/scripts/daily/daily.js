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
    .controller('DailyCtrl', ['$rootScope', '$scope', '$filter', 'localize', 'dailyService', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile',
        function($rootScope, $scope, $filter, localize, dailyService, DTOptionsBuilder, DTColumnBuilder, $compile) {
            //set urls targes please check the backoffice routes configuration
            $scope.didsTarget = "dids"
            $scope.peersTarget = "peers"
            //
            $scope.titleDIDCalls = localize.getLocalizedString("_chart.common.sda.title_");
            $scope.titleInCalls = localize.getLocalizedString("_chart.common.peer.in.title_");
            $scope.titleOutCalls = localize.getLocalizedString("_chart.common.peer.out.title_");
            $scope.titleDIDCallsByHours = localize.getLocalizedString("_chart.common.sda.hour.title_");

            //
            $scope.choiseDid = {};
            $scope.choisePeer = {};
            //
            var yesterday =  new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            $scope.dailyDidDate = yesterday
            $scope.dailyPeerDate = yesterday
            $scope.searchShow = true;
            $scope.searchShowError = false;
            //
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
                DTColumnBuilder.newColumn('disposition').withTitle(localize.getLocalizedString("_cdrs.search.datatables.column.hangup_cause_"))
                .renderWith(function(data, type, full, meta) {
                    return data
                }),
                DTColumnBuilder.newColumn('calls').withTitle(localize.getLocalizedString("_year_dids_table_column_calls_")),
                
                DTColumnBuilder.newColumn('duration').withTitle(localize.getLocalizedString("_year_dids_table_column_duration_")).notSortable()
                .renderWith(function(data, type, full, meta) {                    
                    return data //$scope.SecondsToHMS(data);
                })
            ];
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
                    //console.log("response : " + JSON.stringify(response));
                    $scope.directiveInCallsFn(response.inCalls);
                    $scope.directiveOutCallsFn(response.outCalls);
                    $scope.directivePeerInCallsByHourFn(response.hourlyInCalls);
                    $scope.directivePeerOutCallsByHourFn(response.hourlyOutCalls);
                    return response;
                });
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