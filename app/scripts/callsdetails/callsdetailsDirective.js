'use strict';

angular.module('app')
    .directive('cdrTable', function() {
        return {
            restrict: 'E, A, C',
            controller: function($scope, $element, $attrs, $filter) {

                $scope.columnDefs = [{
                    "mDataProp": "call_date",
                    "aTargets": [0],
                    "bSortable": true,
                    "class": 'details-control',
                    "fnRender": function(oObj) {
                        var jsDate = new Date(oObj.aData.call_date);
                        jsDate = $filter('date')(jsDate, 'dd-MM-yyyy HH:mm:ss');
                        return "<div class='date'>" + jsDate + "</div>";

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
                    "aTargets": [8]
                }, {
                    "mDataProp": "inout_status",
                    "aTargets": [9],
                    "fnRender": function(oObj) {
                        if (oObj.aData.inout_status == "1") {
                            return "Outgoing"
                        } else if (oObj.aData.inout_status == "2") {
                            return "Incomming"
                        } else if (oObj.aData.inout_status == "3") {
                            return "Internal"
                        } else {
                            oObj.aData.inout_status
                        }
                    }
                }];



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
                    }
                };
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
                /*var tt = new $.fn.dataTable.TableTools(table);
            $(tt.fnContainer()).insertBefore('div.dataTables_wrapper')*/

                scope.$watch(attrs.aaData, function(value) {
                    var val = value || null;
                    if (val) {
                        table.fnClearTable();
                        table.fnAddData(scope.$eval(attrs.aaData));
                    }
                });
            }
        };
    })
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