'use strict';

angular.module('app')
    .factory('dailyService', ['$http', '$q',
        function($http, $q) {
            return {
                fetchDidDatas: function(api) {
                    var deferred = $q.defer();
                    $http.get(api).then(function(response) {
                        deferred.resolve(response.data);
                    });
                    return deferred.promise;
                },

                fetchPeerDatas: function(api) {
                    var deferred = $q.defer();
                    $http.get(api).then(function(response) {
                        deferred.resolve(response.data);
                    });
                    return deferred.promise;
                },

                fetchDidCallsByHoursDatas: function(api) {
                    var deferred = $q.defer();
                    $http.get(api).then(function(response) {
                        deferred.resolve(response.data);
                    });
                    return deferred.promise;
                },


            }
        }
    ])
    .factory('dailyWeekDaysTableService', ['$http', '$q', 'localize', 'toolsService', 'DTOptionsBuilder', 'DTColumnBuilder',
        function($http, $q, localize, toolsService, DTOptionsBuilder, DTColumnBuilder) {
            //helper for datatable options and columns definitions
            return {
                buildDTOptions: function(api) {
                     var dtDtOptions = DTOptionsBuilder
                    .fromSource('')
                    .withLanguage({
                        sUrl: toolsService.getDataTableLangUrl()
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
                    .withColVis()
                    .withOption('fnFooterCallback', function (nRow, aasData, iStart, iEnd, aiDisplay) { 
                        var columnas = [2, 3, 4, 5, 6, 7, 8];    
                        var totalGlobal = 0;        
                        for (var j in columnas) {
                            var columnaActual = columnas[j];
                            var total = 0;
                            //for totalize all hours can be used 0 24 range
                            for (var i = iStart; i < iEnd; i++) {
                                var target = "day" + (columnaActual - 1)
                                if (columnaActual != 9 ){
                                    target = "day" + (columnaActual - 1)
                                }
                                total = total +  parseFloat(aasData[i][target]); 
                            }
                            $($(nRow).children().get(columnaActual)).html(total);
                            totalGlobal += total
                           
                        } // end 
                        $($(nRow).children().get(9)).html(totalGlobal);         
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
                     return dtDtOptions;    
                    },

                    buildDTColumnDefs: function() {
                        var columns = [
                            DTColumnBuilder.newColumn('hour').withTitle(localize.getLocalizedString("_hour_")),
                            DTColumnBuilder.newColumn('day1').withTitle(localize.getLocalizedString("_week_day_1_")),
                            DTColumnBuilder.newColumn('day2').withTitle(localize.getLocalizedString("_week_day_2_")),
                            DTColumnBuilder.newColumn('day3').withTitle(localize.getLocalizedString("_week_day_3_")),
                            DTColumnBuilder.newColumn('day4').withTitle(localize.getLocalizedString("_week_day_4_")),
                            DTColumnBuilder.newColumn('day5').withTitle(localize.getLocalizedString("_week_day_5_")),
                            DTColumnBuilder.newColumn('day6').withTitle(localize.getLocalizedString("_week_day_6_")),
                            DTColumnBuilder.newColumn('day7').withTitle(localize.getLocalizedString("_week_day_7_")),                
                            DTColumnBuilder.newColumn('').withTitle(localize.getLocalizedString("_total_")).notSortable()
                            .renderWith(function(data, type, full, meta) { 
                                var total =  full.day1 + full.day2 + full.day3 + full.day4 + full.day5 + full.day6 + full.day7
                                return total
                            })
                        ]
                        return columns;
                    }, // end of buildDTColumnDefs
                }
            }
    ]) // endif weekdays service
    .factory('dailyCallsCauseTableService', ['$http', '$q', '$rootScope', '$compile', 'localize', 'toolsService', 'DTOptionsBuilder', 'DTColumnBuilder',
        function($http, $q, $rootScope, $compile, localize, toolsService, DTOptionsBuilder, DTColumnBuilder) {
            //helper for datatable options and columns definitions
            return {
                buildDTOptions: function(targetColumn,scope) {
                     var dtDtOptions = DTOptionsBuilder
                    .fromSource('')
                    .withOption('createdRow', function(row, data, dataIndex) {
                        // Recompiling so we can bind Angular directive to the DT
                        $compile(angular.element(row).contents())(scope);
                    })
                    .withLanguage({
                        sUrl: toolsService.getDataTableLangUrl()
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
                    .withColVis()
                    .withOption('fnDrawCallback', function ( oSettings  ) {
                        var api = this.api();
                        var rows = api.rows( {page:'current'} ).nodes();
                        var last=null;
                        //targetColumn 
                        var localizeColumnString = "_year_dids_table_column_" + targetColumn + "_";
                        api.column(0, {page:'current'} ).data().each( function ( group, i ) {
                            if ( last !== group ) {
                                $(rows).eq( i ).before(
                                    '<tr class="group"><td colspan="5">  <i class="fa fa-phone"> ' + 
                                    localize.getLocalizedString(localizeColumnString) + ' : ' +group+'</i></td></tr>');
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
                     return dtDtOptions;    
                    },

                    buildDTColumnDefs: function(targetColumn) {
                        var localizeTargetColumnKey = "_year_dids_table_column_did_"
                        if(targetColumn == "peer") {
                            localizeTargetColumnKey = "_year_dids_table_column_peer_"
                        }
                        var columns = [
                            DTColumnBuilder.newColumn(targetColumn).withTitle(localize.getLocalizedString(localizeTargetColumnKey)).notVisible(),
                            DTColumnBuilder.newColumn('disposition').withTitle(localize.getLocalizedString("_cdrs.search.datatables.column.hangup_cause_"))
                            .renderWith(function(data, type, full, meta) {
                                return toolsService.getLabelForHangupCause(data)
                            }),
                            DTColumnBuilder.newColumn('calls').withTitle(localize.getLocalizedString("_year_dids_table_column_calls_")),
                            
                            DTColumnBuilder.newColumn('duration').withTitle(localize.getLocalizedString("_year_dids_table_column_duration_")).notSortable()
                            .renderWith(function(data, type, full, meta) {                    
                                return toolsService.secondsToHMS(data);
                            }),
                            DTColumnBuilder.newColumn('"answerWaitTime').withTitle(localize.getLocalizedString("_cdrs.search.datatables.column.answer_wait_time_")).notSortable()
                            .renderWith(function(data, type, full, meta) {    
                                if(full.disposition == 16 ){
                                    return toolsService.secondsToHMS(data);
                                }
                                return ""
                            })
                        ];
                        return columns
                    }, // end of buildDTColumnDefs
                }
            }
    ]);
    