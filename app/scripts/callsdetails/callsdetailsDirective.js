 'use strict';

 angular.module('app')
     .directive('cdrTable', ['localize',
         function(localize) {
             return {
                 restrict: 'E, A, C',
                 controller: function($rootScope, $scope, $element, $attrs, $filter) {

                    //$scope.out = localize.getLocalizedString("_cdrs.search.direction.option.out_");
                    //localize.getLocalizedString("_cdrs.search.direction.option.in_");
                    //localize.getLocalizedString("_cdrs.search.direction.option.internal_"); 
                     $scope.columnDefs = [{
                         "mDataProp": "call_date",
                         "aTargets": [0],
                         "bSortable": true,
                         "class": 'details-control',
                         "fnRender": function(oObj) {
                             var jsDate = new Date(oObj.aData.call_date);
                             jsDate = $filter('date')(jsDate, 'dd-MM-yyyy HH:mm:ss');
                             return "<div class='date'><i class='icon-zoom-in icon-white'></i>" + jsDate + "</div>";

                         }
                     }, {
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
                     }, {
                         "mDataProp": "duration",
                         "aTargets": [5]
                     }, {
                         "mDataProp": "billsec",
                         "aTargets": [6]
                     }, {
                         "mDataProp": "answer_wait_time",
                         "aTargets": [7]
                     }, {
                         "mDataProp": "disposition_str",
                         "aTargets": [8],
                         "fnRender": function(oObj) { 
                             if (oObj.aData.disposition_str == "ANSWERED") {
                                 return localize.getLocalizedString("_cdrs.search.cause.option.answer_");
                             }else if (oObj.aData.disposition_str == "NO ANSWER") {
                                 return localize.getLocalizedString("_cdrs.search.cause.option.non_answer_");
                             } else if (oObj.aData.disposition_str == "BUSY") {
                                 return localize.getLocalizedString("_cdrs.search.cause.option.busy_");
                             }else if (oObj.aData.disposition_str == "CANCEL") {
                                 return localize.getLocalizedString("_cdrs.search.cause.option.cancel_");
                             }else if (oObj.aData.disposition_str == "FAILED") {
                                 return localize.getLocalizedString("_cdrs.search.cause.option.failed_");
                             }else if (oObj.aData.disposition_str == "CONGESTION") {
                                 return localize.getLocalizedString("_cdrs.search.cause.option.congestion_");
                             } else {
                                 return oObj.aData.disposition_str;
                             }
                         }
                     }, {
                         "mDataProp": "inout_status",
                         "aTargets": [9],
                         "fnRender": function(oObj) {
                             if (oObj.aData.inout_status == "1") {
                                 return localize.getLocalizedString("_cdrs.search.direction.option.out_");
                             } else if (oObj.aData.inout_status == "2") {
                                 return localize.getLocalizedString("_cdrs.search.direction.option.in_");
                             } else if (oObj.aData.inout_status == "3") {
                                 return localize.getLocalizedString("_cdrs.search.direction.option.internal_");
                             } else {
                                 return oObj.aData.inout_status
                             }
                         }
                     }];

                     var langUrl = "i18n/datatable_en-US.js";
                     if (localize.language == "fr-FR") {
                         langUrl = "i18n/datatable_fr-FR.js"
                     }


                     $scope.cdrOverrideOptions = {
                         "bStateSave": true,
                         "iCookieDuration": 2419200,
                         //1 month
                         "bJQueryUI": true,
                         "bPaginate": true,
                         "bLengthChange": true,
                         "bFilter": true,
                         "bInfo": true,
                         "bDestroy": true,
                         "sDom": 'T<"clear"lfrtip',
                         "oTableTools": {
                             'aButtons': [{
                                 'sExtends': 'csv',
                                 'sFileName': 'cdrs.csv',
                                 'mColumns': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                             }, {
                                 'sExtends': 'pdf',
                                 'sFileName': 'cdrs.pdf',
                                 'mColumns': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                             }],
                             'sSwfPath': "http://cdnjs.cloudflare.com/ajax/libs/datatables-tabletools/2.1.5/swf/copy_csv_xls_pdf.swf"
                         },
                         "oLanguage": {
                             //"sUrl": langUrl
                             "sProcessing": localize.getLocalizedString("_cdrs.search.datatables.i18n.sProcessing_"),
                             "sSearch": localize.getLocalizedString("_cdrs.search.datatables.i18n.sSearch_"),
                             "sLengthMenu": localize.getLocalizedString("_cdrs.search.datatables.i18n.sLengthMenu_"),
                             "sInfo": localize.getLocalizedString("_cdrs.search.datatables.i18n.sInfo_"),
                             "sInfoEmpty": localize.getLocalizedString("_cdrs.search.datatables.i18n.sInfoEmpty_"),
                             "sInfoFiltered": localize.getLocalizedString("_cdrs.search.datatables.i18n.sInfoFiltered_"),
                             "sInfoPostFix": "",
                             "sLoadingRecords": localize.getLocalizedString("_cdrs.search.datatables.i18n.sLoadingRecords_"),
                             "sZeroRecords": localize.getLocalizedString("_cdrs.search.datatables.i18n.sZeroRecords_"),
                             "sEmptyTable": localize.getLocalizedString("_cdrs.search.datatables.i18n.sEmptyTable_"),
                             "oPaginate": {
                                 "sFirst": localize.getLocalizedString("_cdrs.search.datatables.i18n.sFirst_"),
                                 "sPrevious": localize.getLocalizedString("_cdrs.search.datatables.i18n.sPrevious_"),
                                 "sNext": localize.getLocalizedString("_cdrs.search.datatables.i18n.sNext_"),
                                 "sLast": localize.getLocalizedString("_cdrs.search.datatables.i18n.sLast_")
                             },
                             "oAria": {
                                 "sSortAscending": localize.getLocalizedString("_cdrs.search.datatables.i18n.sSortAscending_"),
                                 "sSortDescending": localize.getLocalizedString("_cdrs.search.datatables.i18n.sSortDescending_")
                             }
                         }
                     };

                     /*$rootScope.$on('localizeResourcesUpdated', function() {
                    console.log(" cdrTable on localizeResourcesUpdated");
                });*/
                 },
                 link: function(scope, element, attrs, controller) {
                     // apply DataTable options, use defaults if none specified by user
                     var options = {};
                     if (attrs.cdrTable.length > 0) {
                         options = scope.$eval(attrs.cdrTable);
                     } else {
                         options = {
                             "bStateSave": true,
                             "iCookieDuration": 2419200,
                             //1 month 
                             "bJQueryUI": true,
                             "bPaginate": true,
                             "bLengthChange": false,
                             "bFilter": false,
                             "bInfo": false,
                             "bDestroy": true
                         };
                     }

                     var explicitColumns = [];
                     element.find('th').each(function(index, elem) {
                         explicitColumns.push($(elem).text());
                     });
                     if (explicitColumns.length > 0) {
                         options["aoColumns"] = explicitColumns;
                     } else if (attrs.aoColumns) {
                         options["aoColumns"] = scope.$eval(attrs.aoColumns);
                     }

                     if (attrs.aoColumnDefs) {
                         options["aoColumnDefs"] = scope.$eval(attrs.aoColumnDefs);
                     }

                     if (attrs.fnRowCallback) {
                         options["fnRowCallback"] = scope.$eval(attrs.fnRowCallback);
                     }

                     var table = element.dataTable(options);

                     scope.$watch(attrs.aaData, function(value) {
                         var val = value || null;
                         if (val) {
                             table.fnClearTable();
                             table.fnAddData(scope.$eval(attrs.aaData));
                         }
                     });

                 }
             };
         }
     ])
     .directive('integer', function() {
         return {
             restrict: 'A',
             require: '?ngModel',
             link: function(scope, elem, attr, ngModel) {
                 if (!ngModel)
                     return;

                 function isValid(val) {
                     if (val === "")
                         return true;

                     var asInt = parseInt(val, 10);
                     if (asInt === NaN || asInt.toString() !== val) {
                         return false;
                     }

                     var min = parseInt(attr.min);
                     if (min !== NaN && asInt < min) {
                         return false;
                     }

                     var max = parseInt(attr.max);
                     if (max !== NaN && max < asInt) {
                         return false;
                     }

                     return true;
                 }

                 var prev = scope.$eval(attr.ngModel);
                 ngModel.$parsers.push(function(val) {
                     // short-circuit infinite loop
                     if (val === prev)
                         return val;

                     if (!isValid(val)) {
                         ngModel.$setViewValue(prev);
                         ngModel.$render();
                         return prev;
                     }

                     prev = val;
                     return val;
                 });
             }
         };
     });